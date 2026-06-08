import type { ApiFetcher } from '@ts-rest/core';
import { ApiError } from '@apptly/features/lib/api/errors';

export type GetToken = (options?: { template?: string }) => Promise<string | null>;

export interface ApiRuntime {
  baseUrl: string;
  getToken: GetToken;
}

let runtime: ApiRuntime | null = null;

export const setApiRuntime = (next: ApiRuntime): void => {
  runtime = next;
};

const trimBaseUrl = (baseUrl: string): string => baseUrl.replace(/\/+$/, '');

const resolveUrl = (path: string, baseUrl?: string): string => {
  if (/^https?:\/\//.test(path)) return path;
  return `${trimBaseUrl(baseUrl ?? runtime?.baseUrl ?? '')}${path}`;
};

const readBody = async (res: Response): Promise<unknown> => {
  if (res.status === 204) return undefined;
  const type = res.headers.get('content-type') ?? '';
  if (type.includes('json')) return res.json().catch(() => null);
  if (type.startsWith('text/')) return res.text();
  return res.blob();
};

export const createApiFetcher =
  (getToken?: GetToken, baseUrl?: string): ApiFetcher =>
  async ({ path, method, headers, body, fetchOptions }) => {
    const token = await (getToken ?? runtime?.getToken)?.();
    if (!token) throw new ApiError(401, 'no_token', 'Not signed in');

    const res = await fetch(resolveUrl(path, baseUrl), {
      ...fetchOptions,
      method,
      headers: { ...headers, Authorization: `Bearer ${token}` },
      body,
    });

    return { status: res.status, body: await readBody(res), headers: res.headers };
  };

/**
 * Authenticated GET that returns the raw response blob — used for document
 * preview/download, where the body is a PDF/DOCX rather than JSON. Uses the same
 * runtime token + base URL as {@link createApiFetcher}.
 */
export const fetchBlob = async (path: string): Promise<Blob> => {
  const token = await runtime?.getToken?.();
  if (!token) throw new ApiError(401, 'no_token', 'Not signed in');
  const res = await fetch(resolveUrl(path), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new ApiError(res.status, 'fetch_failed', 'Could not load document');
  return res.blob();
};
