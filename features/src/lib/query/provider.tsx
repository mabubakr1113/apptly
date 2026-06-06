import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { Toaster } from '@apptly/ui';
import { useMemo, type ReactNode } from 'react';
import { setApiRuntime, type GetToken } from '@apptly/features/lib/api/runtime';
import { tsr } from '@apptly/features/lib/api/tsr';
import { createQueryClient } from '@apptly/features/lib/query/provider.helpers';

export interface AppDataProviderProps {
  getToken: GetToken;
  baseUrl: string;
  client?: QueryClient;
  children: ReactNode;
}

export const AppDataProvider = ({ getToken, baseUrl, client, children }: AppDataProviderProps) => {
  setApiRuntime({ getToken, baseUrl });
  const queryClient = useMemo(() => client ?? createQueryClient(), [client]);
  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>
        {children}
        <Toaster richColors closeButton />
      </tsr.ReactQueryProvider>
    </QueryClientProvider>
  );
};
