import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import type { DocumentKind } from '@apptly/shared';
import { vi } from 'vitest';
import type { ApiClient } from '@apptly/features/lib/api/client';
import { setApiRuntime } from '@apptly/features/lib/api/runtime';
import { tsr } from '@apptly/features/lib/api/tsr';

const notImplemented = async (): Promise<never> => {
  throw new Error('not implemented in test api');
};

export const makeApi = (overrides: Partial<ApiClient> = {}): ApiClient => ({
  getProfile: async () => null,
  putProfile: notImplemented,
  listApplications: async () => [],
  createApplication: notImplemented,
  updateApplication: notImplemented,
  deleteApplication: async () => {},
  listDocuments: async () => [],
  uploadDocument: notImplemented,
  deleteDocument: async () => {},
  ...overrides,
});

// Mirror the backend: ts-rest JSON-stringifies non-file multipart fields.
const parseField = (value: FormDataEntryValue | null): unknown => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const json = (status: number, body?: unknown): Response =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
  });

const responseFor = async (api: ApiClient, input: RequestInfo | URL, init?: RequestInit) => {
  const url = new URL(String(input));
  const method = init?.method ?? 'GET';
  const id = url.pathname.split('/').at(-1) ?? '';
  if (url.pathname === '/v1/profile' && method === 'GET') {
    const profile = await api.getProfile();
    return profile
      ? json(200, { profile })
      : json(404, { error: { code: 'not_found', message: 'No profile yet' } });
  }
  if (url.pathname === '/v1/profile' && method === 'PUT')
    return json(200, { profile: await api.putProfile(JSON.parse(String(init?.body))) });
  if (url.pathname === '/v1/applications' && method === 'GET')
    return json(200, { applications: await api.listApplications() });
  if (url.pathname === '/v1/applications' && method === 'POST')
    return json(201, { application: await api.createApplication(JSON.parse(String(init?.body))) });
  if (url.pathname.startsWith('/v1/applications/') && method === 'PATCH')
    return json(200, {
      application: await api.updateApplication(id, JSON.parse(String(init?.body))),
    });
  if (url.pathname.startsWith('/v1/applications/') && method === 'DELETE')
    return api.deleteApplication(id).then(() => json(204));
  if (url.pathname === '/v1/documents' && method === 'GET')
    return json(200, { documents: await api.listDocuments() });
  if (url.pathname === '/v1/documents' && method === 'POST' && init?.body instanceof FormData) {
    return json(201, {
      document: await api.uploadDocument({
        file: init.body.get('file') as File,
        kind: parseField(init.body.get('kind')) as DocumentKind,
      }),
    });
  }
  if (url.pathname.startsWith('/v1/documents/') && method === 'GET')
    return new Response(new Blob(['%PDF-1.4 test'], { type: 'application/pdf' }), {
      status: 200,
      headers: { 'Content-Type': 'application/pdf' },
    });
  if (url.pathname.startsWith('/v1/documents/') && method === 'DELETE')
    return api.deleteDocument(id).then(() => json(204));
  return json(404, { error: { code: 'not_found', message: 'Not found' } });
};

export const renderWithApi = (
  ui: ReactElement,
  api: ApiClient = makeApi(),
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) =>
    responseFor(api, input, init),
  );
  setApiRuntime({ baseUrl: 'http://apptly.test', getToken: async () => 'test-token' });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
    </QueryClientProvider>
  );
  return { api, queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
};
