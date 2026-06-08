import { z } from 'zod';
import { emailSchema, nonEmptyString, urlSchema } from '@apptly/shared/schemas/common';
import {
  customQASchema,
  eeoAnswersSchema,
  educationEntrySchema,
  workHistoryEntrySchema,
} from '@apptly/shared/schemas/profile-parts';

/**
 * The user's reusable application profile: the data Apptly uses to autofill job
 * applications. Stored per-user in the backend (D1) and cached on-device. This
 * schema is the single source of truth both the extension and the backend
 * validate against, so it stays runtime-agnostic (no Worker/DOM/node deps).
 */

/** An http(s) URL whose host must be (a subdomain of) `suffix`. */
const hostUrlSchema = (suffix: string, message: string) =>
  urlSchema.refine((u) => {
    try {
      const host = new URL(u).hostname.toLowerCase();
      return host === suffix || host.endsWith(`.${suffix}`);
    } catch {
      return false;
    }
  }, message);

/** A short free-text field, trimmed and length-capped to keep stored PII bounded. */
const shortText = z.string().trim().max(200);

/** Optional contact links. Each, when present, must be an absolute http(s) URL;
 * LinkedIn/GitHub must additionally point at their own sites. */
export const profileLinksSchema = z
  .object({
    linkedin: hostUrlSchema('linkedin.com', 'Must be a linkedin.com link').optional(),
    portfolio: urlSchema.optional(),
    github: hostUrlSchema('github.com', 'Must be a github.com link').optional(),
  })
  .default({});

export const profileSchema = z.object({
  fullName: nonEmptyString,
  email: emailSchema,
  phone: z.string().trim().optional(),
  /** Country (selected from a dropdown in the UI). */
  location: shortText.optional(),
  city: shortText.optional(),
  pronouns: shortText.optional(),
  currentTitle: shortText.optional(),
  currentCompany: shortText.optional(),
  yearsExperience: z.number().int().min(0).max(80).optional(),
  desiredSalary: shortText.optional(),
  noticePeriod: shortText.optional(),
  willingToRelocate: z.boolean().optional(),
  requiresSponsorship: z.boolean().optional(),
  links: profileLinksSchema,
  workHistory: z.array(workHistoryEntrySchema).default([]),
  education: z.array(educationEntrySchema).default([]),
  skills: z.array(nonEmptyString).default([]),
  eeo: eeoAnswersSchema,
  customQA: z.array(customQASchema).default([]),
  /** Document ids (see documentSchema) the user attaches to this profile. */
  documentRefs: z.array(nonEmptyString).default([]),
});

export type Profile = z.infer<typeof profileSchema>;

export * from '@apptly/shared/schemas/profile-parts';
