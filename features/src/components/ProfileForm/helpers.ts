import { eeoAnswersSchema } from '@apptly/shared';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';
import {
  customQARow,
  educationRow,
  skillRow,
  workHistoryRow,
} from '@apptly/features/components/ProfileForm/section-schemas';

/** True for an absolute http(s) URL. */
const isHttp = (v: string) => /^https?:\/\//.test(v);

/** True when `v`'s host is (a subdomain of) `suffix`. */
const hostMatches = (v: string, suffix: string) => {
  try {
    const host = new URL(v).hostname.toLowerCase();
    return host === suffix || host.endsWith(`.${suffix}`);
  } catch {
    return false;
  }
};

/** Optional URL field; if a host `suffix` is given it must match that site. */
const urlField = (suffix?: string, message?: string) =>
  z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || (isHttp(v) && (!suffix || hostMatches(v, suffix))),
      message ?? 'Must start with http:// or https://',
    );

/** The fields the profile form edits. `documentRefs` is preserved on save. */
export const profileFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Required'),
  email: z.string().trim().min(1, 'Required').email('Invalid email address'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || isValidPhoneNumber(v), 'Enter a valid phone number'),
  location: z.string().trim().optional(),
  city: z.string().trim().max(200).optional(),
  pronouns: z.string().trim().max(200).optional(),
  currentTitle: z.string().trim().max(200).optional(),
  currentCompany: z.string().trim().max(200).optional(),
  yearsExperience: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || (/^\d+$/.test(v) && Number(v) <= 80), 'Enter 0–80'),
  desiredSalary: z.string().trim().max(200).optional(),
  noticePeriod: z.string().trim().max(200).optional(),
  willingToRelocate: z.enum(['', 'yes', 'no']).optional(),
  requiresSponsorship: z.enum(['', 'yes', 'no']).optional(),
  linkedin: urlField('linkedin.com', 'Must be a linkedin.com link'),
  portfolio: urlField(),
  github: urlField('github.com', 'Must be a github.com link'),
  workHistory: z.array(workHistoryRow).default([]),
  education: z.array(educationRow).default([]),
  skills: z.array(skillRow).default([]),
  eeo: eeoAnswersSchema,
  customQA: z.array(customQARow).default([]),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
