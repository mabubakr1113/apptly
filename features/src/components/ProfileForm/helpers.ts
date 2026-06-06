import { profileSchema, type Profile } from '@apptly/shared';
import { z } from 'zod';

/** Optional URL field: accepts an http(s) URL or an empty string (the form's
 * "cleared" state), which maps to `undefined` in the domain object. */
const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || /^https?:\/\//.test(v), 'Must start with http:// or https://')
  .optional();

/** The fields the profile form actually edits. Other Profile fields
 * (workHistory, education, skills, eeo, customQA, documentRefs) are preserved
 * from the loaded profile and merged on save. */
export const profileFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Required'),
  email: z.string().trim().min(1, 'Required').email('Invalid email address'),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  linkedin: optionalUrl,
  portfolio: optionalUrl,
  github: optionalUrl,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const EMPTY_PROFILE_FORM: ProfileFormValues = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  portfolio: '',
  github: '',
};

export const toFormValues = (profile: Profile | null | undefined): ProfileFormValues => {
  if (!profile) return EMPTY_PROFILE_FORM;
  return {
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    linkedin: profile.links.linkedin ?? '',
    portfolio: profile.links.portfolio ?? '',
    github: profile.links.github ?? '',
  };
};

const blank = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

export const toProfile = (values: ProfileFormValues, base: Profile | null | undefined): Profile =>
  profileSchema.parse({
    ...(base ?? {}),
    fullName: values.fullName,
    email: values.email,
    phone: blank(values.phone),
    location: blank(values.location),
    links: {
      linkedin: blank(values.linkedin),
      portfolio: blank(values.portfolio),
      github: blank(values.github),
    },
  });
