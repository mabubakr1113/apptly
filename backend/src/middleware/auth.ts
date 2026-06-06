import { verifyToken } from '@clerk/backend';
import { apiError } from '@apptly/shared';
import type { MiddlewareHandler } from 'hono';
import { getDb } from '@apptly/backend/db/client';
import { users } from '@apptly/backend/db/schema';
import type { AppBindings } from '@apptly/backend/env';
import { logger } from '@apptly/backend/logger';

/**
 * Verifies the Clerk session token on every request and derives the user id
 * from the verified token only — a client-supplied id is never trusted.
 *
 * - Missing/malformed `Authorization: Bearer <token>` → 401.
 * - Invalid/expired token, or `azp` not in authorizedParties → 401.
 * - On success: sets `userId` and ensures the user's row exists (first-seen upsert).
 */
export const authMiddleware: MiddlewareHandler<AppBindings> = async (c, next) => {
  const header = c.req.header('Authorization');
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : undefined;

  if (!token) {
    return c.json(apiError('unauthorized', 'Missing bearer token'), 401);
  }

  let userId: string;
  try {
    const claims = await verifyToken(token, {
      secretKey: c.env.CLERK_SECRET_KEY,
      authorizedParties: c.env.CLERK_AUTHORIZED_PARTIES.split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    if (!claims.sub) {
      return c.json(apiError('unauthorized', 'Token has no subject'), 401);
    }
    userId = claims.sub;
  } catch (err) {
    // Never log the token itself; the redacting logger is a backstop.
    logger.warn('token verification failed', err instanceof Error ? err.message : 'unknown');
    return c.json(apiError('unauthorized', 'Invalid or expired token'), 401);
  }

  // First-seen upsert: keep a users row so per-user tables have a valid FK.
  await getDb(c.env)
    .insert(users)
    .values({ clerkUserId: userId, createdAt: new Date().toISOString() })
    .onConflictDoNothing();

  c.set('userId', userId);
  await next();
};
