import { useQueryClient } from '@tanstack/react-query';
import { tsr } from '@apptly/features/lib/api/tsr';
import { queryKeys } from '@apptly/features/lib/query/keys';

export const useApplications = () =>
  tsr.listApplications.useQuery({
    queryKey: queryKeys.applications,
    select: (res) => res.body.applications,
  });

export const useCreateApplication = () => {
  const qc = useQueryClient();
  return tsr.createApplication.useMutation({
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.applications }),
  });
};

export const useUpdateApplication = () => {
  const qc = useQueryClient();
  return tsr.updateApplication.useMutation({
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.applications }),
  });
};

export const useDeleteApplication = () => {
  const qc = useQueryClient();
  return tsr.deleteApplication.useMutation({
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.applications }),
  });
};
