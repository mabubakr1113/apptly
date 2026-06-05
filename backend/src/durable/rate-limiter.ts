import { DurableObject } from 'cloudflare:workers';
import type { Env } from '../env';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Epoch ms at which the current window resets. */
  resetAt: number;
}

/**
 * Per-user fixed-window rate limiter. One Durable Object instance per user
 * (keyed by userId) gives atomic, race-free counting: the DO runtime serializes
 * all calls to a single instance, so the read-modify-write below cannot
 * interleave. State lives in the DO's (SQLite-backed) storage.
 */
export class RateLimiter extends DurableObject<Env> {
  async increment(limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now();
    const state = await this.ctx.storage.get<{ count: number; resetAt: number }>('window');

    // Start a fresh window if none exists or the current one has elapsed.
    if (!state || now >= state.resetAt) {
      const resetAt = now + windowMs;
      await this.ctx.storage.put('window', { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (state.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: state.resetAt };
    }

    const count = state.count + 1;
    await this.ctx.storage.put('window', { count, resetAt: state.resetAt });
    return { allowed: true, remaining: limit - count, resetAt: state.resetAt };
  }
}
