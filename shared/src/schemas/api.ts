import { z } from 'zod';
import { applicationRecordSchema } from '@apptly/shared/schemas/application';
import { documentSchema } from '@apptly/shared/schemas/document';
import { profileSchema } from '@apptly/shared/schemas/profile';

/**
 * Request/response envelopes shared by the front-end and backend so both parse
 * the same shapes. Errors always use {@link apiErrorSchema}.
 */

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export const profileResponseSchema = z.object({
  profile: profileSchema,
});

export const applicationsListResponseSchema = z.object({
  applications: z.array(applicationRecordSchema),
});

export const applicationResponseSchema = z.object({
  application: applicationRecordSchema,
});

export const documentResponseSchema = z.object({
  document: documentSchema,
});

export const documentsListResponseSchema = z.object({
  documents: z.array(documentSchema),
});

/** Build a standard error body. */
export function apiError(code: string, message: string): z.infer<typeof apiErrorSchema> {
  return { error: { code, message } };
}

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type ApplicationsListResponse = z.infer<typeof applicationsListResponseSchema>;
export type ApplicationResponse = z.infer<typeof applicationResponseSchema>;
export type DocumentResponse = z.infer<typeof documentResponseSchema>;
export type DocumentsListResponse = z.infer<typeof documentsListResponseSchema>;
