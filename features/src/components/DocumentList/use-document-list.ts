import { DocumentKindValue, type DocumentMeta } from '@apptly/shared';
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
  const [preview, setPreview] = useState<DocumentMeta | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DocumentMeta | null>(null);
  const { mutate, isPending } = remove;
  const columns = useMemo(
    () => createDocumentColumns(setPreview, setPendingDelete),
    [],
  );
  const confirmDelete = () => {
    if (!pendingDelete) return;
    mutate({ params: { id: pendingDelete.id } }, { onSuccess: () => setPendingDelete(null) });
  };
  const table = useReactTable({
    data: query.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const hasResume = (query.data ?? []).some((doc) => doc.kind === DocumentKindValue.Resume);
  return {
    table,
    isLoading: query.isLoading,
    error: query.error,
    hasResume,
    preview,
    setPreview,
    pendingDelete,
    setPendingDelete,
    confirmDelete,
    isDeleting: isPending,
  };
};
