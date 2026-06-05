import { Hono } from 'hono';
import type { AppBindings } from '../env';

// Public liveness check (mounted before auth).
export const health = new Hono<AppBindings>().get('/health', (c) => c.json({ status: 'ok' }));
