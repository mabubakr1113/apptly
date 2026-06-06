import { z } from 'zod';
import { nonEmptyString } from './common';

/**
 * Document (resume / cover letter / tailored CV) metadata. The blob itself
 * lives in R2 at `{userId}/{id}`; this row lives in D1. Upload constraints are
 * exported as shared constants so the extension and backend enforce the same
 * size cap and allowed types.
 */

/** Maximum accepted document size: 10 MiB. */
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

/** Allowed upload MIME types: PDF and DOCX. */
export const ALLOWED_DOCUMENT_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const documentKind = z.enum(['resume', 'cover_letter', 'tailored_cv']);

export const documentSchema = z.object({
  id: nonEmptyString,
  kind: documentKind,
  filename: nonEmptyString,
  /** R2 object key, server-owned: `{userId}/{id}`. */
  r2Key: nonEmptyString,
  /** Hex SHA-256 of the blob, for dedupe / integrity. */
  contentHash: nonEmptyString,
  size: z.number().int().nonnegative().max(MAX_DOCUMENT_BYTES),
  /** ISO timestamp, server-owned. */
  createdAt: z.string().datetime(),
});

export type DocumentKind = z.infer<typeof documentKind>;
export type DocumentMeta = z.infer<typeof documentSchema>;
