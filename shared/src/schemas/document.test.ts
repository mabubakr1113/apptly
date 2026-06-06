import { describe, expect, it } from 'vitest';
import { ALLOWED_DOCUMENT_MIME, MAX_DOCUMENT_BYTES, documentSchema } from './document';

const validDoc = {
  id: 'doc_1',
  kind: 'resume',
  filename: 'ada-cv.pdf',
  r2Key: 'user_1/doc_1',
  contentHash: 'a'.repeat(64),
  size: 1024,
  createdAt: '2026-06-05T12:00:00.000Z',
};

describe('documentSchema', () => {
  it('accepts valid document metadata', () => {
    expect(documentSchema.parse(validDoc).filename).toBe('ada-cv.pdf');
  });

  it('rejects an unknown kind', () => {
    expect(documentSchema.safeParse({ ...validDoc, kind: 'photo' }).success).toBe(false);
  });

  it('rejects a size over the cap', () => {
    expect(documentSchema.safeParse({ ...validDoc, size: MAX_DOCUMENT_BYTES + 1 }).success).toBe(
      false,
    );
  });

  it('rejects a negative size', () => {
    expect(documentSchema.safeParse({ ...validDoc, size: -1 }).success).toBe(false);
  });
});

describe('upload constraints', () => {
  it('caps documents at 10 MiB', () => {
    expect(MAX_DOCUMENT_BYTES).toBe(10 * 1024 * 1024);
  });

  it('allows PDF and DOCX', () => {
    expect(ALLOWED_DOCUMENT_MIME).toContain('application/pdf');
    expect(ALLOWED_DOCUMENT_MIME).toContain(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  });
});
