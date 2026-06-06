import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AppBindings } from '@apptly/backend/env';
import { authMiddleware } from '@apptly/backend/middleware/auth';
import { errorHandler, notFoundHandler } from '@apptly/backend/middleware/error';
import { rateLimitMiddleware } from '@apptly/backend/middleware/rate-limit';
import { applicationRoutes } from '@apptly/backend/routes/applications';
import { documentRoutes } from '@apptly/backend/routes/documents';
import { health } from '@apptly/backend/routes/health';
import { profile } from '@apptly/backend/routes/profile';

const app = new Hono<AppBindings>();

app.onError(errorHandler);
app.notFound(notFoundHandler);

// CORS restricted to the configured origins (extension + web domain).
app.use('/v1/*', (c, next) =>
  cors({
    origin: c.env.CORS_ALLOWED_ORIGINS.split(',').map((s) => s.trim()),
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400,
  })(c, next),
);

// Public.
app.route('/v1', health);

// Everything else requires a verified Clerk token, then per-user rate limiting.
app.use('/v1/*', authMiddleware);
app.use('/v1/*', rateLimitMiddleware);

app.route('/v1', profile);
app.route('/v1', applicationRoutes);
app.route('/v1', documentRoutes);

export default app;
export { RateLimiter } from '@apptly/backend/durable/rate-limiter';
