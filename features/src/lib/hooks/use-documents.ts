import { useQueryClient } from '@tanstack/react-query';
import { tsr } from '@apptly/features/lib/api/tsr';
import { queryKeys } from '@apptly/features/lib/query/keys';

export const useDocuments = () =>
  tsr.listDocuments.useQuery({
    queryKey: queryKeys.documents,
    select: (res) => res.body.documents,
  });

export const useUploadDocument = () => {
  const qc = useQueryClient();
  return tsr.uploadDocument.useMutation({
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.documents }),
  });
};

export const useDeleteDocument = () => {
  const qc = useQueryClient();
  return tsr.deleteDocument.useMutation({
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.documents }),
  });
};
