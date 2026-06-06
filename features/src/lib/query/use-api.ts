import { createContext, useContext } from 'react';
import type { ApiClient } from '@apptly/features/lib/api/client';

/** Holds the configured API client, provided by {@link AppDataProvider}. */
export const ApiContext = createContext<ApiClient | null>(null);

/** Access the API client. Throws if used outside an AppDataProvider. */
export const useApi = (): ApiClient => {
  const api = useContext(ApiContext);
  if (!api) {
    throw new Error('useApi must be used within an <AppDataProvider>');
  }
  return api;
};
