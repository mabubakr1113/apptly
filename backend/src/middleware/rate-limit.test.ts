import { beforeEach, describe, expect, it } from 'vitest';
import { asUser, authedFetch, resetAuth } from '@apptly/backend/test/helpers';

beforeEach(resetAuth);

describe('rate limiting', () => {
  // RATE_LIMIT_MAX is 10 in the test env (vitest.config.ts).
  it('allows up to the limit then returns 429 with Retry-After', async () => {
    asUser('user_rl');

    for (let i = 0; i < 10; i++) {
      const res = await authedFetch('/v1/applications');
      expect(res.status).toBe(200);
    }

    const blocked = await authedFetch('/v1/applications');
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
    expect(await blocked.json()).toMatchObject({ error: { code: 'rate_limited' } });
  });

  it('counts each user independently', async () => {
    asUser('user_rl_other');
    const res = await authedFetch('/v1/applications');
    expect(res.status).toBe(200);
    expect(res.headers.get('RateLimit-Remaining')).toBe('9');
  });
});
