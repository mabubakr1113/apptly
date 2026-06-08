import { profileSchema, type Profile } from '@apptly/shared';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import {
  EMPTY_EEO,
  sectionsFromForm,
  sectionsToForm,
} from '@apptly/features/components/ProfileForm/section-mappers';

export const EMPTY_PROFILE_FORM: ProfileFormValues = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  city: '',
  pronouns: '',
  currentTitle: '',
  currentCompany: '',
  yearsExperience: '',
  desiredSalary: '',
  noticePeriod: '',
  willingToRelocate: '',
  requiresSponsorship: '',
  linkedin: '',
  portfolio: '',
  github: '',
  workHistory: [],
  education: [],
  skills: [],
  eeo: EMPTY_EEO,
  customQA: [],
};

const toTri = (v: boolean | undefined): '' | 'yes' | 'no' =>
  v === undefined ? '' : v ? 'yes' : 'no';

const fromTri = (v: '' | 'yes' | 'no' | undefined): boolean | undefined =>
  v === 'yes' ? true : v === 'no' ? false : undefined;

export const toFormValues = (profile: Profile | null | undefined): ProfileFormValues => {
  if (!profile) return EMPTY_PROFILE_FORM;
  return {
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    city: profile.city ?? '',
    pronouns: profile.pronouns ?? '',
    currentTitle: profile.currentTitle ?? '',
    currentCompany: profile.currentCompany ?? '',
    yearsExperience: profile.yearsExperience?.toString() ?? '',
    desiredSalary: profile.desiredSalary ?? '',
    noticePeriod: profile.noticePeriod ?? '',
    willingToRelocate: toTri(profile.willingToRelocate),
    requiresSponsorship: toTri(profile.requiresSponsorship),
    linkedin: profile.links.linkedin ?? '',
    portfolio: profile.links.portfolio ?? '',
    github: profile.links.github ?? '',
    ...sectionsToForm(profile),
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
    city: blank(values.city),
    pronouns: blank(values.pronouns),
    currentTitle: blank(values.currentTitle),
    currentCompany: blank(values.currentCompany),
    yearsExperience: values.yearsExperience ? Number(values.yearsExperience) : undefined,
    desiredSalary: blank(values.desiredSalary),
    noticePeriod: blank(values.noticePeriod),
    willingToRelocate: fromTri(values.willingToRelocate),
    requiresSponsorship: fromTri(values.requiresSponsorship),
    links: {
      linkedin: blank(values.linkedin),
      portfolio: blank(values.portfolio),
      github: blank(values.github),
    },
    ...sectionsFromForm(values),
  });
