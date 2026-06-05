import { describe, expect, it } from 'vitest';
import { appFetch } from '../test/helpers';

describe('GET /v1/health', () => {
  it('returns 200 without authentication', async () => {
    const res = await appFetch('/v1/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });
});
