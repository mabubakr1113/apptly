import type { RateLimiter } from './durable/rate-limiter';

/** Worker bindings + vars. Mirrors the bindings declared in wrangler.toml. */
export interface Env {
  DB: D1Database;
  DOCS: R2Bucket;
  RATE_LIMITER: DurableObjectNamespace<RateLimiter>;
  /** Clerk secret key (Workers Secret / .dev.vars) — never client-side. */
  CLERK_SECRET_KEY: string;
  /** Comma-separated Clerk authorizedParties (extension origin + web domain). */
  CLERK_AUTHORIZED_PARTIES: string;
  /** Comma-separated CORS allowlist. */
  CORS_ALLOWED_ORIGINS: string;
  RATE_LIMIT_MAX: string;
  RATE_LIMIT_WINDOW_MS: string;
}

/** Hono context variables set by middleware. */
export interface Variables {
  /** Clerk user id (the verified token's `sub`). Set by the auth middleware. */
  userId: string;
}

export interface AppBindings {
  Bindings: Env;
  Variables: Variables;
}
