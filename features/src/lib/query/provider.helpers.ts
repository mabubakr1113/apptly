import { MutationCache, QueryClient, type QueryClientConfig } from '@tanstack/react-query';
import { toast } from '@apptly/ui';
import { messageForError } from '@apptly/features/lib/api/errors';

export const createQueryClient = (): QueryClient => {
  const config: QueryClientConfig = {
    defaultOptions: {
      queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
      mutations: { retry: 0 },
    },
    mutationCache: new MutationCache({ onError: (error) => toast.error(messageForError(error)) }),
  };
  return new QueryClient(config);
};
