import { apiError } from '@apptly/shared';
import type { MiddlewareHandler } from 'hono';
import type { AppBindings } from '../env';
import { logger } from '../logger';

/**
 * Per-user fixed-window rate limit, backed by the RateLimiter Durable Object
 * (one instance per userId → atomic counting). Must run after authMiddleware so
 * `userId` is set. Over-limit → 429 with a Retry-After header.
 */
export const rateLimitMiddleware: MiddlewareHandler<AppBindings> = async (c, next) => {
  const userId = c.get('userId');
  const limit = Number(c.env.RATE_LIMIT_MAX);
  const windowMs = Number(c.env.RATE_LIMIT_WINDOW_MS);

  // Fail closed on misconfiguration: a NaN limit/window would silently disable
  // rate limiting and emit invalid RateLimit headers, so reject with a 500.
  if (!Number.isFinite(limit) || limit <= 0 || !Number.isFinite(windowMs) || windowMs <= 0) {
    logger.error('invalid rate limit config', `max=${c.env.RATE_LIMIT_MAX} window=${c.env.RATE_LIMIT_WINDOW_MS}`);
    return c.json(apiError('internal_error', 'Rate limiter misconfigured'), 500);
  }

  const stub = c.env.RATE_LIMITER.get(c.env.RATE_LIMITER.idFromName(userId));
  const { allowed, remaining, resetAt } = await stub.increment(limit, windowMs);

  c.header('RateLimit-Limit', String(limit));
  c.header('RateLimit-Remaining', String(Math.max(0, remaining)));
  c.header('RateLimit-Reset', String(Math.ceil((resetAt - Date.now()) / 1000)));

  if (!allowed) {
    c.header('Retry-After', String(Math.ceil((resetAt - Date.now()) / 1000)));
    return c.json(apiError('rate_limited', 'Too many requests'), 429);
  }

  await next();
};
