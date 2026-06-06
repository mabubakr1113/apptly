import { beforeEach, describe, expect, it } from 'vitest';
import { asUser, authedFetch, resetAuth } from '@apptly/backend/test/helpers';

const sampleProfile = { fullName: 'Ada Lovelace', email: 'ada@example.com' };

beforeEach(resetAuth);

describe('profile routes', () => {
  it('returns 404 before a profile is saved', async () => {
    asUser('user_p1');
    const res = await authedFetch('/v1/profile');
    expect(res.status).toBe(404);
  });

  it('upserts then reads the profile back (round-trip)', async () => {
    asUser('user_p2');

    const put = await authedFetch('/v1/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleProfile),
    });
    expect(put.status).toBe(200);

    const get = await authedFetch('/v1/profile');
    expect(get.status).toBe(200);
    const body = (await get.json()) as { profile: { fullName: string; email: string } };
    expect(body.profile.fullName).toBe('Ada Lovelace');
    expect(body.profile.email).toBe('ada@example.com');
    // Defaults applied by the shared schema survive the round-trip.
    expect(body.profile).toMatchObject({ eeo: { gender: 'decline' } });
  });

  it('rejects an invalid profile body (400)', async () => {
    asUser('user_p3');
    const res = await authedFetch('/v1/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    expect(res.status).toBe(400);
  });
});
