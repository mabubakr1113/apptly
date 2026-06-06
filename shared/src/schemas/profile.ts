import { z } from 'zod';
import { emailSchema, nonEmptyString, urlSchema } from '@apptly/shared/schemas/common';

/**
 * The user's reusable application profile: the data Apptly uses to autofill job
 * applications. Stored per-user in the backend (D1) and cached on-device. This
 * schema is the single source of truth both the extension and the backend
 * validate against, so it stays runtime-agnostic (no Worker/DOM/node deps).
 */

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
 * EEO / voluntary self-identification answers. These default to
 * decline-to-answer so we never volunteer sensitive demographic data the user
 * has not explicitly chosen to share.
 */
export enum VoluntaryAnswerValue {
  Decline = 'decline',
  Yes = 'yes',
  No = 'no',
}

export const voluntaryAnswer = z
  .nativeEnum(VoluntaryAnswerValue)
  .default(VoluntaryAnswerValue.Decline);

export const eeoAnswersSchema = z
  .object({
    gender: voluntaryAnswer,
    race: voluntaryAnswer,
    veteranStatus: voluntaryAnswer,
    disabilityStatus: voluntaryAnswer,
  })
  .default({
    gender: VoluntaryAnswerValue.Decline,
    race: VoluntaryAnswerValue.Decline,
    veteranStatus: VoluntaryAnswerValue.Decline,
    disabilityStatus: VoluntaryAnswerValue.Decline,
  });

/** A reusable custom question/answer the user keeps for application forms. */
export const customQASchema = z.object({
  question: nonEmptyString,
  answer: z.string().trim(),
});

/** Optional contact links. Each, when present, must be an absolute http(s) URL. */
export const profileLinksSchema = z
  .object({
    linkedin: urlSchema.optional(),
    portfolio: urlSchema.optional(),
    github: urlSchema.optional(),
  })
  .default({});

export const profileSchema = z.object({
  fullName: nonEmptyString,
  email: emailSchema,
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  links: profileLinksSchema,
  workHistory: z.array(workHistoryEntrySchema).default([]),
  education: z.array(educationEntrySchema).default([]),
  skills: z.array(nonEmptyString).default([]),
  eeo: eeoAnswersSchema,
  customQA: z.array(customQASchema).default([]),
  /** Document ids (see documentSchema) the user attaches to this profile. */
  documentRefs: z.array(nonEmptyString).default([]),
});

export type WorkHistoryEntry = z.infer<typeof workHistoryEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type CustomQA = z.infer<typeof customQASchema>;
export type Profile = z.infer<typeof profileSchema>;
