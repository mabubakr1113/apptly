import { describe, expect, it } from 'vitest';
import { profileSchema } from '@apptly/shared/schemas/profile';

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

  it('keeps explicit EEO answers the user chose to share', () => {
    const parsed = profileSchema.parse({
      ...minimalProfile,
      eeo: { gender: 'woman', veteranStatus: 'protected_veteran', disabilityStatus: 'no' },
    });
    expect(parsed.eeo.gender).toBe('woman');
    expect(parsed.eeo.veteranStatus).toBe('protected_veteran');
    expect(parsed.eeo.disabilityStatus).toBe('no');
    expect(parsed.eeo.race).toBe('decline');
  });

  it('uses a per-field option set (gender is not yes/no)', () => {
    expect(profileSchema.safeParse({ ...minimalProfile, eeo: { gender: 'woman' } }).success).toBe(
      true,
    );
    // A yes/no answer is not meaningful for gender — it degrades to decline.
    const coerced = profileSchema.parse({ ...minimalProfile, eeo: { gender: 'yes' } });
    expect(coerced.eeo.gender).toBe('decline');
  });

  it('degrades unknown/legacy EEO values to decline rather than failing', () => {
    const parsed = profileSchema.parse({ ...minimalProfile, eeo: { race: 'maybe' } });
    expect(parsed.eeo.race).toBe('decline');
  });

  it('rejects a non-http link', () => {
    const result = profileSchema.safeParse({
      ...minimalProfile,
      links: { github: 'ftp://example.com' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a LinkedIn link that is not on linkedin.com', () => {
    const result = profileSchema.safeParse({
      ...minimalProfile,
      links: { linkedin: 'https://example.com/in/ada' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a GitHub link that is not on github.com', () => {
    const result = profileSchema.safeParse({
      ...minimalProfile,
      links: { github: 'https://gitlab.com/ada' },
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid linkedin.com and github.com links (incl. subdomains)', () => {
    const parsed = profileSchema.parse({
      ...minimalProfile,
      links: {
        linkedin: 'https://www.linkedin.com/in/ada',
        github: 'https://github.com/ada',
      },
    });
    expect(parsed.links.linkedin).toBe('https://www.linkedin.com/in/ada');
    expect(parsed.links.github).toBe('https://github.com/ada');
  });

  it('accepts the optional application fields', () => {
    const parsed = profileSchema.parse({
      ...minimalProfile,
      location: 'Finland',
      city: 'Helsinki',
      pronouns: 'she/her',
      currentTitle: 'Senior Engineer',
      currentCompany: 'Analytical Engines',
      yearsExperience: 8,
      desiredSalary: '€90k',
      noticePeriod: '1 month',
      willingToRelocate: true,
      requiresSponsorship: false,
    });
    expect(parsed.city).toBe('Helsinki');
    expect(parsed.yearsExperience).toBe(8);
    expect(parsed.willingToRelocate).toBe(true);
    expect(parsed.requiresSponsorship).toBe(false);
  });

  it('rejects an out-of-range yearsExperience', () => {
    expect(profileSchema.safeParse({ ...minimalProfile, yearsExperience: 200 }).success).toBe(false);
  });

  it('rejects a missing required name', () => {
    expect(profileSchema.safeParse({ email: 'ada@example.com' }).success).toBe(false);
  });

  it('normalizes the email to trimmed lowercase', () => {
    const parsed = profileSchema.parse({ ...minimalProfile, email: '  Ada@Example.COM ' });
    expect(parsed.email).toBe('ada@example.com');
  });
});
