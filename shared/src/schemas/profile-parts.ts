import { z } from 'zod';
import { nonEmptyString } from '@apptly/shared/schemas/common';

/** Sub-schemas of the Profile, split out to keep `profile.ts` focused. */

/** A single past role in the user's work history. */
export const workHistoryEntrySchema = z.object({
  company: nonEmptyString,
  title: nonEmptyString,
  /** Free-form date strings (e.g. "2021-03", "Mar 2021") — kept as text by design. */
  start: nonEmptyString,
  end: z.string().trim().optional(),
  summary: z.string().trim().optional(),
});

/** A single education entry. */
export const educationEntrySchema = z.object({
  school: nonEmptyString,
  degree: z.string().trim().optional(),
  field: z.string().trim().optional(),
  start: z.string().trim().optional(),
  end: z.string().trim().optional(),
});

/**
 * EEO / voluntary self-identification answers. Every field has its own option
 * set (a single yes/no does not make sense for gender or race), defaults to
 * decline-to-answer, and degrades unknown/legacy values to `decline` — so we
 * never volunteer sensitive demographic data the user has not chosen to share.
 */
export const GENDER_VALUES = ['woman', 'man', 'non_binary', 'self_describe', 'decline'] as const;
export const RACE_VALUES = [
  'hispanic_latino',
  'white',
  'black',
  'asian',
  'native_american',
  'pacific_islander',
  'two_or_more',
  'decline',
] as const;
export const VETERAN_VALUES = ['protected_veteran', 'not_protected_veteran', 'decline'] as const;
export const DISABILITY_VALUES = ['yes', 'no', 'decline'] as const;

/** An enum field that fills in / falls back to `decline` for missing or unknown input. */
const eeoField = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values).default('decline').catch('decline');

export const eeoAnswersSchema = z
  .object({
    gender: eeoField(GENDER_VALUES),
    race: eeoField(RACE_VALUES),
    veteranStatus: eeoField(VETERAN_VALUES),
    disabilityStatus: eeoField(DISABILITY_VALUES),
  })
  .default({});

/** A reusable custom question/answer the user keeps for application forms. */
export const customQASchema = z.object({
  question: nonEmptyString,
  answer: z.string().trim(),
});

export type WorkHistoryEntry = z.infer<typeof workHistoryEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type CustomQA = z.infer<typeof customQASchema>;
