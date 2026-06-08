import { MAX_DOCUMENT_BYTES } from '@apptly/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { asUser, authedFetch, resetAuth } from '@apptly/backend/test/helpers';

beforeEach(resetAuth);

function uploadForm(file: File, kind = 'resume'): FormData {
  const form = new FormData();
  form.set('file', file);
  form.set('kind', kind);
  return form;
}

const pdf = (bytes = 8) => new File([new Uint8Array(bytes)], 'cv.pdf', { type: 'application/pdf' });

describe('document upload', () => {
  it('stores a valid PDF and returns metadata', async () => {
    asUser('user_d1');
    const res = await authedFetch('/v1/documents', { method: 'POST', body: uploadForm(pdf()) });
    expect(res.status).toBe(201);
    const body = (await res.json()) as {
      document: { id: string; r2Key: string; kind: string; contentHash: string };
    };
    expect(body.document.kind).toBe('resume');
    expect(body.document.r2Key).toBe(`user_d1/${body.document.id}`);
    expect(body.document.contentHash).toHaveLength(64);
  });

  it('accepts a JSON-stringified kind (how the ts-rest client sends it)', async () => {
    asUser('user_d1b');
    // ts-rest's client JSON-stringifies non-file multipart fields, so `kind`
    // arrives quoted. The route must still parse it.
    const res = await authedFetch('/v1/documents', {
      method: 'POST',
      body: uploadForm(pdf(), JSON.stringify('cover_letter')),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as { document: { kind: string } };
    expect(body.document.kind).toBe('cover_letter');
  });

  it('lists only the caller’s documents', async () => {
    asUser('user_dl1');
    await authedFetch('/v1/documents', { method: 'POST', body: uploadForm(pdf()) });
    asUser('user_dl1');
    await authedFetch('/v1/documents', {
      method: 'POST',
      body: uploadForm(pdf(), 'cover_letter'),
    });

    asUser('user_dl1');
    const res = await authedFetch('/v1/documents');
    expect(res.status).toBe(200);
    const { documents } = (await res.json()) as { documents: { kind: string }[] };
    expect(documents).toHaveLength(2);
    expect(documents.map((d) => d.kind).sort()).toEqual(['cover_letter', 'resume']);

    // A different user sees none of them.
    asUser('user_dl2');
    const other = await authedFetch('/v1/documents');
    expect(((await other.json()) as { documents: unknown[] }).documents).toHaveLength(0);
  });

  it('rejects a disallowed MIME type (415)', async () => {
    asUser('user_d2');
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    const res = await authedFetch('/v1/documents', { method: 'POST', body: uploadForm(file) });
    expect(res.status).toBe(415);
  });

  it('rejects a document over the size cap (413)', async () => {
    asUser('user_d3');
    const tooBig = pdf(MAX_DOCUMENT_BYTES + 1);
    const res = await authedFetch('/v1/documents', { method: 'POST', body: uploadForm(tooBig) });
    expect(res.status).toBe(413);
  });

  it('rejects a missing file (400)', async () => {
    asUser('user_d4');
    const form = new FormData();
    form.set('kind', 'resume');
    const res = await authedFetch('/v1/documents', { method: 'POST', body: form });
    expect(res.status).toBe(400);
  });

  it('round-trips the blob on download', async () => {
    asUser('user_d5');
    const create = await authedFetch('/v1/documents', {
      method: 'POST',
      body: uploadForm(
        new File([new Uint8Array([1, 2, 3, 4])], 'cv.pdf', { type: 'application/pdf' }),
      ),
    });
    const { document } = (await create.json()) as { document: { id: string } };

    asUser('user_d5');
    const get = await authedFetch(`/v1/documents/${document.id}`);
    expect(get.status).toBe(200);
    expect(get.headers.get('Content-Type')).toBe('application/pdf');
    expect(new Uint8Array(await get.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3, 4]));
  });
});

describe('per-user isolation (documents)', () => {
  it("user B cannot download or delete user A's document", async () => {
    asUser('user_a');
    const create = await authedFetch('/v1/documents', { method: 'POST', body: uploadForm(pdf()) });
    const { document } = (await create.json()) as { document: { id: string } };

    asUser('user_b');
    expect((await authedFetch(`/v1/documents/${document.id}`)).status).toBe(404);

    asUser('user_b');
    expect((await authedFetch(`/v1/documents/${document.id}`, { method: 'DELETE' })).status).toBe(
      404,
    );

    // A can still fetch it. Consume the R2-backed body so its stream is closed
    // before teardown (an open R2 stream leaves a SQLite WAL file behind).
    asUser('user_a');
    const ok = await authedFetch(`/v1/documents/${document.id}`);
    expect(ok.status).toBe(200);
    await ok.arrayBuffer();
  });
});
