// Test-only replacement for `@clerk/backend` (wired via the resolve alias in
// vitest.config.ts). The real package bundles cleanly for `wrangler deploy`,
// but its transitive CJS/ESM deps trip the stricter vitest Workers bundler — and
// every test controls auth by stubbing token verification anyway.
//
// This is a plain controllable function rather than a `vi.fn()`: the rejection
// for the invalid-token case is created inside the call the middleware awaits
// (and catches), so there is no dangling rejected promise for the Workers test
// runner to flag as unhandled. Drive it via the helpers in ./helpers.ts.
type VerifyResult = { sub?: string };
type VerifyFn = (token: string, options?: unknown) => Promise<VerifyResult>;

const defaultImpl: VerifyFn = async () => {
  throw new Error('verifyToken not configured for this test');
};

let impl: VerifyFn = defaultImpl;

/** Number of times the middleware invoked verifyToken (for "not called" assertions). */
export const verifyState = { calls: 0 };

export const verifyToken: VerifyFn = (token, options) => {
  verifyState.calls += 1;
  return impl(token, options);
};

export function __setVerify(fn: VerifyFn): void {
  impl = fn;
}

export function __resetVerify(): void {
  impl = defaultImpl;
  verifyState.calls = 0;
}
