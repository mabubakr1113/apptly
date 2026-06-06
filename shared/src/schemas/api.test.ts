import { describe, expect, it } from 'vitest';
import { apiError, apiErrorSchema, profileResponseSchema } from '@apptly/shared/schemas/api';

describe('apiErrorSchema', () => {
  it('accepts a well-formed error envelope', () => {
    expect(
      apiErrorSchema.safeParse({ error: { code: 'unauthorized', message: 'no' } }).success,
    ).toBe(true);
  });

  it('rejects a bare message without the envelope', () => {
    expect(apiErrorSchema.safeParse({ message: 'no' }).success).toBe(false);
  });
});

describe('apiError', () => {
  it('builds an envelope that satisfies the schema', () => {
    const built = apiError('rate_limited', 'slow down');
    expect(apiErrorSchema.parse(built)).toEqual(built);
  });
});

describe('profileResponseSchema', () => {
  it('wraps a valid profile', () => {
    const result = profileResponseSchema.safeParse({
      profile: { fullName: 'Ada', email: 'ada@example.com' },
    });
    expect(result.success).toBe(true);
  });
});
