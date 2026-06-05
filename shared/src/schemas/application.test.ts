import { describe, expect, it } from 'vitest';
import {
  applicationCreateSchema,
  applicationPatchSchema,
  applicationRecordSchema,
} from './application';

const fullRecord = {
  id: 'app_1',
  company: 'Acme Corp',
  position: 'Senior Engineer',
  status: 'applied',
  updatedAt: '2026-06-05T12:00:00.000Z',
};

describe('applicationRecordSchema', () => {
  it('accepts a valid record', () => {
    expect(applicationRecordSchema.parse(fullRecord).company).toBe('Acme Corp');
  });

  it('rejects an unknown status', () => {
    expect(applicationRecordSchema.safeParse({ ...fullRecord, status: 'ghosted' }).success).toBe(
      false,
    );
  });

  it('rejects a non-ISO updatedAt', () => {
    expect(
      applicationRecordSchema.safeParse({ ...fullRecord, updatedAt: 'yesterday' }).success,
    ).toBe(false);
  });

  it('rejects a non-http jobUrl', () => {
    expect(applicationRecordSchema.safeParse({ ...fullRecord, jobUrl: 'acme.com' }).success).toBe(
      false,
    );
  });
});

describe('applicationCreateSchema', () => {
  it('defaults status to saved and does not require server-owned fields', () => {
    const parsed = applicationCreateSchema.parse({ company: 'Acme', position: 'Eng' });
    expect(parsed.status).toBe('saved');
    expect('id' in parsed).toBe(false);
    expect('updatedAt' in parsed).toBe(false);
  });
});

describe('applicationPatchSchema', () => {
  it('accepts a partial update', () => {
    expect(applicationPatchSchema.parse({ status: 'interview' }).status).toBe('interview');
  });

  it('accepts an empty patch', () => {
    expect(applicationPatchSchema.safeParse({}).success).toBe(true);
  });

  it('still validates provided fields', () => {
    expect(applicationPatchSchema.safeParse({ status: 'nope' }).success).toBe(false);
  });
});
