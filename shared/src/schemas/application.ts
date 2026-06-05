import { z } from 'zod';
import { nonEmptyString, urlSchema } from './common';

/**
 * A single tracked job application. The backend owns `id` and `updatedAt`;
 * clients send `*Create` (no server-owned fields) to create and `*Patch`
 * (everything optional) to update.
 */

export const applicationStatus = z.enum([
  'saved',
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
]);

export const applicationRecordSchema = z.object({
  id: nonEmptyString,
  company: nonEmptyString,
  position: nonEmptyString,
  jobUrl: urlSchema.optional(),
  source: z.string().trim().optional(),
  location: z.string().trim().optional(),
  /** Free-form date string (e.g. "2026-06-05") — kept as text by design. */
  dateApplied: z.string().trim().optional(),
  status: applicationStatus,
  salaryText: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  resumeDocId: nonEmptyString.optional(),
  coverLetterDocId: nonEmptyString.optional(),
  /** ISO timestamp, server-owned; used for last-write-wins reconciliation. */
  updatedAt: z.string().datetime(),
});

/** Payload to create a record: server owns `id` and `updatedAt`. */
export const applicationCreateSchema = applicationRecordSchema
  .omit({ id: true, updatedAt: true })
  .extend({ status: applicationStatus.default('saved') });

/** Payload to patch a record: every client-settable field is optional. */
export const applicationPatchSchema = applicationCreateSchema.partial();

export type ApplicationStatus = z.infer<typeof applicationStatus>;
export type ApplicationRecord = z.infer<typeof applicationRecordSchema>;
export type ApplicationCreate = z.infer<typeof applicationCreateSchema>;
export type ApplicationPatch = z.infer<typeof applicationPatchSchema>;
