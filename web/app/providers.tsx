'use client';

import { AppDataProvider } from '@apptly/features';
import { useAuth } from '@clerk/nextjs';
import { useCallback, type ReactNode } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

/**
 * Bridges Clerk's session token into the shared `@apptly/features` data layer
 * (TanStack Query + the typed sync client). Identical wiring to the extension's
 * `AppDataProvider` usage, so both surfaces talk to the same backend the same way.
 */
export const Providers = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();

  // Match the features `GetToken` signature (it only reads `template`).
  const getTokenForApi = useCallback(
    (options?: { template?: string }) => getToken(options),
    [getToken],
  );

  return (
    <AppDataProvider getToken={getTokenForApi} baseUrl={baseUrl}>
      {children}
    </AppDataProvider>
  );
};
