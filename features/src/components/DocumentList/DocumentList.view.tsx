import type { DocumentMeta } from '@apptly/shared';
import type { Table } from '@tanstack/react-table';
import { Box, Text } from '@apptly/ui';
import { DataTable } from '@apptly/features/components/DataTable';
import { DocumentPreview } from '@apptly/features/components/DocumentList/DocumentPreview';
import { DeleteConfirmDialogView } from '@apptly/features/components/DocumentList/DeleteConfirmDialog.view';
import { messageForError } from '@apptly/features/lib/api/errors';
import { DOCUMENT_LIST_COPY } from '@apptly/features/components/DocumentList/copy';

export interface DocumentListViewProps {
  table: Table<DocumentMeta>;
  isLoading: boolean;
  error: unknown;
  hasResume: boolean;
  preview: DocumentMeta | null;
  setPreview: (doc: DocumentMeta | null) => void;
  pendingDelete: DocumentMeta | null;
  setPendingDelete: (doc: DocumentMeta | null) => void;
  confirmDelete: () => void;
  isDeleting: boolean;
}

export const DocumentListView = ({
  table,
  isLoading,
  error,
  hasResume,
  preview,
  setPreview,
  pendingDelete,
  setPendingDelete,
  confirmDelete,
  isDeleting,
}: DocumentListViewProps) => {
  if (error) return <Text className="text-sm text-destructive">{messageForError(error)}</Text>;
  return (
    <Box className="flex flex-col gap-3">
      {!isLoading && !hasResume ? (
        <Text className="text-sm font-medium text-destructive">
          {DOCUMENT_LIST_COPY.resumeRequired}
        </Text>
      ) : null}
      <DataTable
        table={table}
        isLoading={isLoading}
        loadingText={DOCUMENT_LIST_COPY.loading}
        emptyText={DOCUMENT_LIST_COPY.empty}
      />
      <DocumentPreview doc={preview} onClose={() => setPreview(null)} />
      <DeleteConfirmDialogView
        doc={pendingDelete}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />
    </Box>
  );
};
