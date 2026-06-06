import type { DocumentMeta } from '@apptly/shared';
import type { Table } from '@tanstack/react-table';
import { Text } from '@apptly/ui';
import { DataTable } from '@apptly/features/components/DataTable';
import { messageForError } from '@apptly/features/lib/api/errors';
import { DOCUMENT_LIST_COPY } from '@apptly/features/components/DocumentList/copy';

export interface DocumentListViewProps {
  table: Table<DocumentMeta>;
  isLoading: boolean;
  error: unknown;
}

export const DocumentListView = ({ table, isLoading, error }: DocumentListViewProps) => {
  if (error) return <Text className="text-sm text-destructive">{messageForError(error)}</Text>;
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      loadingText={DOCUMENT_LIST_COPY.loading}
      emptyText={DOCUMENT_LIST_COPY.empty}
    />
  );
};
