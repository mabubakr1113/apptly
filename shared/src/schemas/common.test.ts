import { describe, expect, it } from 'vitest';
import { emailSchema, nonEmptyString, urlSchema } from '@apptly/shared/schemas/common';

describe('nonEmptyString', () => {
  it('accepts non-empty input and trims it', () => {
    expect(nonEmptyString.parse('  hi  ')).toBe('hi');
  });

  it('rejects whitespace-only input', () => {
    expect(nonEmptyString.safeParse('   ').success).toBe(false);
  });
});

describe('emailSchema', () => {
  it('normalizes a valid email to trimmed lowercase', () => {
    expect(emailSchema.parse('  Test@Example.COM ')).toBe('test@example.com');
  });

  it('rejects an invalid email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });
});

describe('urlSchema', () => {
  it('accepts an absolute https URL', () => {
    expect(urlSchema.parse('https://example.com/jobs/1')).toBe('https://example.com/jobs/1');
  });

  it('rejects a non-URL string', () => {
    expect(urlSchema.safeParse('example dot com').success).toBe(false);
  });
});
