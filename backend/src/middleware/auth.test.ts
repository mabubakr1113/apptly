import { beforeEach, describe, expect, it } from 'vitest';
import {
  appFetch,
  asInvalidToken,
  asTokenWithoutSubject,
  asUser,
  authedFetch,
  resetAuth,
  verifyCallCount,
} from '../test/helpers';

beforeEach(resetAuth);

describe('auth middleware', () => {
  it('rejects a request with no token (401)', async () => {
    const res = await appFetch('/v1/applications');
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ error: { code: 'unauthorized' } });
    expect(verifyCallCount()).toBe(0);
  });

  it('rejects an invalid/expired token (401)', async () => {
    asInvalidToken();
    const res = await authedFetch('/v1/applications');
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ error: { code: 'unauthorized' } });
  });

  it('rejects a token without a subject (401)', async () => {
    asTokenWithoutSubject();
    const res = await authedFetch('/v1/applications');
    expect(res.status).toBe(401);
  });

  it('admits a valid token and scopes the request to its subject', async () => {
    asUser('user_valid');
    const res = await authedFetch('/v1/applications');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ applications: [] });
  });
});
