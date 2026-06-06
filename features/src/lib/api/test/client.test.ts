import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@apptly/features/lib/api/errors';
import { createApiClient } from '@apptly/features/lib/api/client';

const BASE = 'http://localhost:8787';
const PROFILE = { fullName: 'Ada Lovelace', email: 'ada@example.com' };
const APP = {
  id: 'a1',
  company: 'Acme',
  position: 'SWE',
  status: 'applied',
  updatedAt: '2026-06-05T00:00:00.000Z',
};
const DOC = {
  id: 'd1',
  kind: 'resume',
  filename: 'cv.pdf',
  r2Key: 'u/d1',
  contentHash: 'abc',
  size: 10,
  createdAt: '2026-06-05T00:00:00.000Z',
};

const json = (status: number, body: unknown): Response =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const getToken = vi.fn<() => Promise<string | null>>();
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  getToken.mockResolvedValue('tok_123');
  fetchMock.mockReset();
});
afterEach(() => {
  vi.unstubAllGlobals();
  getToken.mockReset();
});

const client = () => createApiClient({ getToken, baseUrl: BASE });

describe('api client', () => {
  it('attaches the bearer token', async () => {
    fetchMock.mockResolvedValue(json(200, { applications: [] }));
    await client().listApplications();
    const [, init] = fetchMock.mock.calls[0];
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer tok_123');
  });

  it('throws before fetch when there is no token', async () => {
    getToken.mockResolvedValue(null);
    await expect(client().getProfile()).rejects.toMatchObject({ code: 'no_token', status: 401 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('getProfile returns null on 404', async () => {
    fetchMock.mockResolvedValue(json(404, { error: { code: 'not_found', message: 'x' } }));
    await expect(client().getProfile()).resolves.toBeNull();
  });

  it('getProfile parses and applies schema defaults', async () => {
    fetchMock.mockResolvedValue(json(200, { profile: PROFILE }));
    const p = await client().getProfile();
    expect(p?.email).toBe('ada@example.com');
    expect(p?.eeo.gender).toBe('decline');
  });

  it('createApplication POSTs JSON and returns the record', async () => {
    fetchMock.mockResolvedValue(json(201, { application: APP }));
    const rec = await client().createApplication({ company: 'Acme', position: 'SWE' } as never);
    expect(rec.id).toBe('a1');
    const [u, init] = fetchMock.mock.calls[0];
    expect(u).toBe(`${BASE}/v1/applications`);
    expect(init?.method).toBe('POST');
  });

  it('deleteApplication tolerates a 204 with no body', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(client().deleteApplication('a1')).resolves.toBeUndefined();
  });

  it('uploadDocument sends multipart form data (no JSON content-type)', async () => {
    fetchMock.mockResolvedValue(json(201, { document: DOC }));
    const file = new File(['x'], 'cv.pdf', { type: 'application/pdf' });
    const meta = await client().uploadDocument({ file, kind: 'resume' });
    expect(meta.id).toBe('d1');
    const [, init] = fetchMock.mock.calls[0];
    expect(init?.body).toBeInstanceOf(FormData);
    expect((init?.headers as Record<string, string>)['Content-Type']).toBeUndefined();
  });

  it('throws a typed ApiError carrying the server code/message', async () => {
    fetchMock.mockResolvedValue(json(413, { error: { code: 'too_large', message: 'Too big' } }));
    const file = new File(['x'], 'cv.pdf', { type: 'application/pdf' });
    const err = await client()
      .uploadDocument({ file, kind: 'resume' })
      .catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 413, code: 'too_large' });
  });
});
