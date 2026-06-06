import { beforeEach, describe, expect, it } from 'vitest';
import { asUser, authedFetch, resetAuth } from '../test/helpers';

beforeEach(resetAuth);

async function createApp(user: string, body: Record<string, unknown>): Promise<string> {
  asUser(user);
  const res = await authedFetch('/v1/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  expect(res.status).toBe(201);
  const json = (await res.json()) as { application: { id: string } };
  return json.application.id;
}

describe('application CRUD', () => {
  it('creates, lists, patches, and deletes', async () => {
    const id = await createApp('user_a', { company: 'Acme', position: 'Engineer' });

    asUser('user_a');
    const list = await authedFetch('/v1/applications');
    expect(list.status).toBe(200);
    expect((await list.json()) as { applications: unknown[] }).toMatchObject({
      applications: [{ id, company: 'Acme', status: 'saved' }],
    });

    asUser('user_a');
    const patch = await authedFetch(`/v1/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'interview' }),
    });
    expect(patch.status).toBe(200);
    expect((await patch.json()) as { application: { status: string } }).toMatchObject({
      application: { status: 'interview' },
    });

    asUser('user_a');
    expect((await authedFetch(`/v1/applications/${id}`, { method: 'DELETE' })).status).toBe(204);

    asUser('user_a');
    expect((await authedFetch('/v1/applications')).status).toBe(200);
    expect(await (await authedFetch('/v1/applications')).json()).toEqual({ applications: [] });
  });

  it('rejects an invalid create body (400)', async () => {
    asUser('user_a');
    const res = await authedFetch('/v1/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company: 'Acme' }), // missing position
    });
    expect(res.status).toBe(400);
  });
});

describe('per-user isolation (applications)', () => {
  it("user B cannot read, patch, or delete user A's application", async () => {
    const id = await createApp('user_a', { company: 'Acme', position: 'Engineer' });

    // User B's list is empty.
    asUser('user_b');
    expect(await (await authedFetch('/v1/applications')).json()).toEqual({ applications: [] });

    // User B cannot patch A's record.
    asUser('user_b');
    const patch = await authedFetch(`/v1/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' }),
    });
    expect(patch.status).toBe(404);

    // User B cannot delete A's record.
    asUser('user_b');
    expect((await authedFetch(`/v1/applications/${id}`, { method: 'DELETE' })).status).toBe(404);

    // A's record is untouched.
    asUser('user_a');
    const list = (await (await authedFetch('/v1/applications')).json()) as {
      applications: { status: string }[];
    };
    expect(list.applications[0].status).toBe('saved');
  });
});
