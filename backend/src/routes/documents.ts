import {
  ALLOWED_DOCUMENT_MIME,
  MAX_DOCUMENT_BYTES,
  documentKind,
  type DocumentMeta,
} from '@apptly/shared';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { getDb } from '@apptly/backend/db/client';
import { documents } from '@apptly/backend/db/schema';
import type { AppBindings } from '@apptly/backend/env';

type Row = typeof documents.$inferSelect;

const ALLOWED_MIME: readonly string[] = ALLOWED_DOCUMENT_MIME;

function rowToMeta(row: Row): DocumentMeta {
  return {
    id: row.id,
    kind: row.kind as DocumentMeta['kind'],
    filename: row.filename,
    r2Key: row.r2Key,
    contentHash: row.contentHash,
    size: row.size,
    createdAt: row.createdAt,
  };
}

async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Builds a safe `Content-Disposition` value. The ASCII `filename` strips
 * quotes/control chars (which could otherwise corrupt the header or, in some
 * runtimes, enable header injection); `filename*` carries the full UTF-8 name
 * per RFC 5987 for clients that support it.
 */
function contentDisposition(filename: string): string {
  const ascii = filename.replace(/["\\\r\n]/g, '_').replace(/[^\x20-\x7e]/g, '_');
  const encoded = encodeURIComponent(filename);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

export const documentRoutes = new Hono<AppBindings>()
  // Upload a document: enforce size + MIME, store blob in R2, metadata in D1.
  .post('/documents', async (c) => {
    const body = await c.req.parseBody();
    const file = body['file'];
    const kindResult = documentKind.safeParse(body['kind']);

    if (!(file instanceof File)) {
      return c.json({ error: { code: 'invalid_body', message: 'Missing file' } }, 400);
    }
    if (!kindResult.success) {
      return c.json({ error: { code: 'invalid_body', message: 'Invalid kind' } }, 400);
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return c.json({ error: { code: 'unsupported_type', message: 'Only PDF or DOCX' } }, 415);
    }
    if (file.size > MAX_DOCUMENT_BYTES) {
      return c.json({ error: { code: 'too_large', message: 'Document exceeds size cap' } }, 413);
    }

    const userId = c.get('userId');
    const id = crypto.randomUUID();
    const r2Key = `${userId}/${id}`;
    const bytes = await file.arrayBuffer();

    await c.env.DOCS.put(r2Key, bytes, { httpMetadata: { contentType: file.type } });

    const row: Row = {
      id,
      userId,
      kind: kindResult.data,
      filename: file.name,
      r2Key,
      contentHash: await sha256Hex(bytes),
      size: file.size,
      createdAt: new Date().toISOString(),
    };
    try {
      await getDb(c.env).insert(documents).values(row);
    } catch (err) {
      // Metadata insert failed after the blob landed in R2 — delete the orphan
      // so a failed upload doesn't leak unreachable storage, then rethrow.
      await c.env.DOCS.delete(r2Key).catch(() => {});
      throw err;
    }

    return c.json({ document: rowToMeta(row) }, 201);
  })
  // Download a document blob (ownership-checked).
  .get('/documents/:id', async (c) => {
    const row = await getDb(c.env)
      .select()
      .from(documents)
      .where(and(eq(documents.id, c.req.param('id')), eq(documents.userId, c.get('userId'))))
      .get();
    if (!row) {
      return c.json({ error: { code: 'not_found', message: 'Document not found' } }, 404);
    }

    const object = await c.env.DOCS.get(row.r2Key);
    if (!object) {
      return c.json({ error: { code: 'not_found', message: 'Blob missing' } }, 404);
    }

    c.header('Content-Type', object.httpMetadata?.contentType ?? 'application/octet-stream');
    c.header('Content-Disposition', contentDisposition(row.filename));
    return c.body(object.body);
  })
  // Delete a document (ownership-checked): remove blob then row.
  .delete('/documents/:id', async (c) => {
    const db = getDb(c.env);
    const row = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, c.req.param('id')), eq(documents.userId, c.get('userId'))))
      .get();
    if (!row) {
      return c.json({ error: { code: 'not_found', message: 'Document not found' } }, 404);
    }

    await c.env.DOCS.delete(row.r2Key);
    await db.delete(documents).where(eq(documents.id, row.id));
    return c.body(null, 204);
  });
