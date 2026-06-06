import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useDeleteDocument, useDocuments } from '@apptly/features/lib/hooks/use-documents';
import { createDocumentColumns } from '@apptly/features/components/DocumentList/columns';

export const useDocumentList = () => {
  const query = useDocuments();
  const remove = useDeleteDocument();
  const [sorting, setSorting] = useState<SortingState>([]);
  const { mutate, isPending } = remove;
  const columns = useMemo(
    () => createDocumentColumns((id) => mutate({ params: { id } }), isPending),
    [mutate, isPending],
  );
  const table = useReactTable({
    data: query.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return { table, isLoading: query.isLoading, error: query.error };
};
