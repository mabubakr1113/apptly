/**
 * Builds the Content-Security-Policy header value. Nonce-based + `strict-dynamic`
 * so only our nonce'd scripts (and what they load, e.g. Clerk) execute — see
 * AGENT.md / architecture.md §11. Clerk's hosts are allowed where it needs to
 * connect, frame, and load assets.
 */
export interface CspOptions {
  nonce: string;
  isDev: boolean;
  /** Origin of the sync API (the Worker), e.g. `http://localhost:8787`. */
  apiOrigin?: string;
}

const CLERK = 'https://*.clerk.accounts.dev https://*.clerk.com';

export const buildCsp = ({ nonce, isDev, apiOrigin }: CspOptions): string => {
  // Dev needs eval (react-refresh) and a websocket (HMR); prod gets neither.
  const devScript = isDev ? " 'unsafe-eval'" : '';
  const devConnect = isDev ? ' ws:' : '';
  const api = apiOrigin ? ` ${apiOrigin}` : '';

  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${devScript}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' https://img.clerk.com data:`,
    `font-src 'self' data:`,
    `connect-src 'self' https://clerk-telemetry.com ${CLERK}${api}${devConnect}`,
    `frame-src 'self' ${CLERK} https://challenges.cloudflare.com`,
    `worker-src 'self' blob:`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
  ].join('; ');
};

/** Extracts the origin from a full URL, or undefined if absent/invalid. */
export const originOf = (url?: string): string | undefined => {
  if (!url) return undefined;
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
};
