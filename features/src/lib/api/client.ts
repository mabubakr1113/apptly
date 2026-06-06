import { initClient } from '@ts-rest/core';
import {
  apiErrorSchema,
  applicationResponseSchema,
  applicationsListResponseSchema,
  apptlyContract,
  documentResponseSchema,
  documentsListResponseSchema,
  profileResponseSchema,
  type ApplicationCreate,
  type ApplicationPatch,
  type ApplicationRecord,
  type DocumentKind,
  type DocumentMeta,
  type Profile,
} from '@apptly/shared';
import type { z } from 'zod';
import { ApiError } from '@apptly/features/lib/api/errors';
import { createApiFetcher, type GetToken } from '@apptly/features/lib/api/runtime';

export type { GetToken };

export interface ApiClientOptions {
  getToken: GetToken;
  baseUrl: string;
}

export interface ApiClient {
  getProfile(): Promise<Profile | null>;
  putProfile(profile: Profile): Promise<Profile>;
  listApplications(): Promise<ApplicationRecord[]>;
  createApplication(input: ApplicationCreate): Promise<ApplicationRecord>;
  updateApplication(id: string, patch: ApplicationPatch): Promise<ApplicationRecord>;
  deleteApplication(id: string): Promise<void>;
  listDocuments(): Promise<DocumentMeta[]>;
  uploadDocument(input: { file: File; kind: DocumentKind }): Promise<DocumentMeta>;
  deleteDocument(id: string): Promise<void>;
}

type ContractResponse = { status: number; body: unknown };

const toApiError = ({ status, body }: ContractResponse): ApiError => {
  const parsed = apiErrorSchema.safeParse(body);
  return parsed.success
    ? new ApiError(status, parsed.data.error.code, parsed.data.error.message)
    : new ApiError(status, 'http_error', `Request failed (${status})`);
};

const bodyOrThrow = <Schema extends z.ZodTypeAny>(
  response: ContractResponse,
  schema: Schema,
): z.output<Schema> => {
  if (response.status >= 400) throw toApiError(response);
  return schema.parse(response.body);
};

export const createApiClient = ({ getToken, baseUrl }: ApiClientOptions): ApiClient => {
  const client = initClient(apptlyContract, {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    api: createApiFetcher(getToken),
    validateResponse: false,
    throwOnUnknownStatus: true,
  });

  return {
    async getProfile() {
      const res = await client.getProfile();
      if (res.status === 404) return null;
      return bodyOrThrow(res, profileResponseSchema).profile;
    },
    async putProfile(profile) {
      return bodyOrThrow(await client.putProfile({ body: profile }), profileResponseSchema).profile;
    },
    async listApplications() {
      return bodyOrThrow(await client.listApplications(), applicationsListResponseSchema)
        .applications;
    },
    async createApplication(input) {
      return bodyOrThrow(await client.createApplication({ body: input }), applicationResponseSchema)
        .application;
    },
    async updateApplication(id, patch) {
      return bodyOrThrow(
        await client.updateApplication({ params: { id }, body: patch }),
        applicationResponseSchema,
      ).application;
    },
    async deleteApplication(id) {
      const res = await client.deleteApplication({ params: { id } });
      if (res.status >= 400) throw toApiError(res);
    },
    async listDocuments() {
      return bodyOrThrow(await client.listDocuments(), documentsListResponseSchema).documents;
    },
    async uploadDocument(input) {
      return bodyOrThrow(await client.uploadDocument({ body: input }), documentResponseSchema)
        .document;
    },
    async deleteDocument(id) {
      const res = await client.deleteDocument({ params: { id } });
      if (res.status >= 400) throw toApiError(res);
    },
  };
};
