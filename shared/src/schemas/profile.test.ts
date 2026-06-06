import { describe, expect, it } from 'vitest';
import { profileSchema } from './profile';

const minimalProfile = {
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
};

describe('profileSchema', () => {
  it('accepts a minimal profile and applies defaults', () => {
    const parsed = profileSchema.parse(minimalProfile);
    expect(parsed.fullName).toBe('Ada Lovelace');
    expect(parsed.email).toBe('ada@example.com');
    expect(parsed.skills).toEqual([]);
    expect(parsed.workHistory).toEqual([]);
    expect(parsed.education).toEqual([]);
    expect(parsed.customQA).toEqual([]);
    expect(parsed.documentRefs).toEqual([]);
    expect(parsed.links).toEqual({});
  });

  it('defaults all EEO answers to decline-to-answer', () => {
    const parsed = profileSchema.parse(minimalProfile);
    expect(parsed.eeo).toEqual({
      gender: 'decline',
      race: 'decline',
      veteranStatus: 'decline',
      disabilityStatus: 'decline',
    });
  });

  it('keeps an explicit EEO answer the user chose to share', () => {
    const parsed = profileSchema.parse({ ...minimalProfile, eeo: { veteranStatus: 'no' } });
    expect(parsed.eeo.veteranStatus).toBe('no');
    expect(parsed.eeo.gender).toBe('decline');
  });

  it('rejects an invalid EEO answer', () => {
    const result = profileSchema.safeParse({ ...minimalProfile, eeo: { gender: 'maybe' } });
    expect(result.success).toBe(false);
  });

  it('rejects a non-http link', () => {
    const result = profileSchema.safeParse({
      ...minimalProfile,
      links: { github: 'ftp://example.com' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a missing required name', () => {
    expect(profileSchema.safeParse({ email: 'ada@example.com' }).success).toBe(false);
  });

  it('normalizes the email to trimmed lowercase', () => {
    const parsed = profileSchema.parse({ ...minimalProfile, email: '  Ada@Example.COM ' });
    expect(parsed.email).toBe('ada@example.com');
  });
});
