import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Profile } from '@apptly/shared';
import { tsr } from '@apptly/features/lib/api/tsr';
import { queryKeys } from '@apptly/features/lib/query/keys';

export const useProfile = () =>
  useQuery<Profile | null, unknown>({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const res = await tsr.getProfile.query();
      if (res.status === 404) return null;
      if (res.status === 200) return res.body.profile;
      throw res;
    },
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return tsr.putProfile.useMutation({
    onSuccess: (saved) => qc.setQueryData(queryKeys.profile, saved.body.profile),
  });
};
