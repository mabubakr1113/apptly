import { apiError } from '@apptly/shared';
import type { ErrorHandler, NotFoundHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { AppBindings } from '../env';
import { logger } from '../logger';

/** Uniform 404 in the shared apiError shape. */
export const notFoundHandler: NotFoundHandler<AppBindings> = (c) =>
  c.json(apiError('not_found', 'Resource not found'), 404);

/**
 * Uniform error handler. HTTPExceptions keep their status; anything else is a
 * 500 with a generic message (internal details are logged, never returned).
 */
export const errorHandler: ErrorHandler<AppBindings> = (err, c) => {
  if (err instanceof HTTPException) {
    return c.json(apiError(`http_${err.status}`, err.message), err.status);
  }
  logger.error('unhandled error', err instanceof Error ? err.message : 'unknown');
  return c.json(apiError('internal_error', 'Internal server error'), 500);
};
