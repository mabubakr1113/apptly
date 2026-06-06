import { env } from 'cloudflare:test';
import app from '@apptly/backend/index';
import { __resetVerify, __setVerify, verifyState } from '@apptly/backend/test/clerk-stub';

const BASE = 'https://test.local';

/** Dispatch a request through the real app against the isolated test env. */
export function appFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return Promise.resolve(app.fetch(new Request(`${BASE}${path}`, init), env));
}

/** Same, with an Authorization header (the token value is irrelevant — verification is stubbed). */
export function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', 'Bearer test-token');
  return appFetch(path, { ...init, headers });
}

/** Make token verification succeed, resolving to the given Clerk user id. */
export const asUser = (id: string): void => __setVerify(async () => ({ sub: id }));

/** Make token verification fail (invalid/expired token). */
export const asInvalidToken = (): void =>
  __setVerify(async () => {
    throw new Error('invalid or expired token');
  });

/** Make token verification succeed but without a subject claim. */
export const asTokenWithoutSubject = (): void => __setVerify(async () => ({}));

/** Reset the verification stub between tests. */
export const resetAuth = (): void => __resetVerify();

/** How many times the middleware invoked verifyToken since the last reset. */
export const verifyCallCount = (): number => verifyState.calls;
