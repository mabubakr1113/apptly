import {
  applicationCreateSchema,
  applicationPatchSchema,
  applicationStatus,
  ApplicationStatusValue,
  type ApplicationCreate,
  type ApplicationPatch,
  type ApplicationRecord,
} from '@apptly/shared';
import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || /^https?:\/\//.test(v), 'Must start with http:// or https://')
  .optional();

export const applicationFormSchema = z.object({
  company: z.string().trim().min(1, 'Required'),
  position: z.string().trim().min(1, 'Required'),
  status: applicationStatus,
  jobUrl: optionalUrl,
  location: z.string().trim().optional(),
  source: z.string().trim().optional(),
  salaryText: z.string().trim().optional(),
  dateApplied: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export const EMPTY_APPLICATION_FORM: ApplicationFormValues = {
  company: '',
  position: '',
  status: ApplicationStatusValue.Saved,
  jobUrl: '',
  location: '',
  source: '',
  salaryText: '',
  dateApplied: '',
  notes: '',
};

export const toFormValues = (record: ApplicationRecord): ApplicationFormValues => ({
  company: record.company,
  position: record.position,
  status: record.status,
  jobUrl: record.jobUrl ?? '',
  location: record.location ?? '',
  source: record.source ?? '',
  salaryText: record.salaryText ?? '',
  dateApplied: record.dateApplied ?? '',
  notes: record.notes ?? '',
});

const blank = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

const toShared = (values: ApplicationFormValues): ApplicationCreate => ({
  company: values.company,
  position: values.position,
  status: values.status,
  jobUrl: blank(values.jobUrl),
  location: blank(values.location),
  source: blank(values.source),
  salaryText: blank(values.salaryText),
  dateApplied: blank(values.dateApplied),
  notes: blank(values.notes),
});

export const toCreate = (values: ApplicationFormValues): ApplicationCreate =>
  applicationCreateSchema.parse(toShared(values));

export const toPatch = (values: ApplicationFormValues): ApplicationPatch =>
  applicationPatchSchema.parse(toShared(values));
