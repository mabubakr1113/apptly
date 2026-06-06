import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useApplications, useDeleteApplication } from '@apptly/features/lib/hooks/use-applications';
import { createApplicationColumns } from '@apptly/features/components/TrackerTable/columns';

export const useTrackerTable = () => {
  const query = useApplications();
  const remove = useDeleteApplication();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const { mutate, isPending } = remove;
  const columns = useMemo(
    () => createApplicationColumns((id) => mutate({ params: { id } }), isPending),
    [mutate, isPending],
  );

  const table = useReactTable({
    data: query.data ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return { table, isLoading: query.isLoading, error: query.error, globalFilter, setGlobalFilter };
};
