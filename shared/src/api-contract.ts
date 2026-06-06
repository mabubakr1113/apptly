import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  apiErrorSchema,
  applicationResponseSchema,
  applicationsListResponseSchema,
  documentResponseSchema,
  documentsListResponseSchema,
  profileResponseSchema,
} from '@apptly/shared/schemas/api';
import {
  applicationCreateSchema,
  applicationPatchSchema,
} from '@apptly/shared/schemas/application';
import { documentKind } from '@apptly/shared/schemas/document';
import { profileSchema } from '@apptly/shared/schemas/profile';

const c = initContract();
const idParams = z.object({ id: z.string().min(1) });
const uploadBody = z.object({
  file: z.custom<File>((value) => typeof File !== 'undefined' && value instanceof File),
  kind: documentKind,
});

export const apptlyContract = c.router(
  {
    getProfile: {
      method: 'GET',
      path: '/profile',
      responses: { 200: profileResponseSchema, 404: apiErrorSchema },
    },
    putProfile: {
      method: 'PUT',
      path: '/profile',
      body: profileSchema,
      responses: { 200: profileResponseSchema, 400: apiErrorSchema },
    },
    listApplications: {
      method: 'GET',
      path: '/applications',
      responses: { 200: applicationsListResponseSchema },
    },
    createApplication: {
      method: 'POST',
      path: '/applications',
      body: applicationCreateSchema,
      responses: { 201: applicationResponseSchema, 400: apiErrorSchema },
    },
    updateApplication: {
      method: 'PATCH',
      path: '/applications/:id',
      pathParams: idParams,
      body: applicationPatchSchema,
      responses: { 200: applicationResponseSchema, 400: apiErrorSchema, 404: apiErrorSchema },
    },
    deleteApplication: {
      method: 'DELETE',
      path: '/applications/:id',
      pathParams: idParams,
      body: c.noBody(),
      responses: { 204: c.noBody(), 404: apiErrorSchema },
    },
    listDocuments: {
      method: 'GET',
      path: '/documents',
      responses: { 200: documentsListResponseSchema },
    },
    uploadDocument: {
      method: 'POST',
      path: '/documents',
      contentType: 'multipart/form-data',
      body: uploadBody,
      responses: {
        201: documentResponseSchema,
        400: apiErrorSchema,
        413: apiErrorSchema,
        415: apiErrorSchema,
      },
    },
    deleteDocument: {
      method: 'DELETE',
      path: '/documents/:id',
      pathParams: idParams,
      body: c.noBody(),
      responses: { 204: c.noBody(), 404: apiErrorSchema },
    },
  },
  { pathPrefix: '/v1', strictStatusCodes: true },
);

export type ApptlyContract = typeof apptlyContract;
