import type { ApplicationRecord } from '@apptly/shared';
import type { Table } from '@tanstack/react-table';
import { Box, Input, Text } from '@apptly/ui';
import { ApplicationForm } from '@apptly/features/components/ApplicationForm';
import { DataTable } from '@apptly/features/components/DataTable';
import { messageForError } from '@apptly/features/lib/api/errors';
import { TRACKER_TABLE_COPY } from '@apptly/features/components/TrackerTable/copy';

export interface TrackerTableViewProps {
  table: Table<ApplicationRecord>;
  isLoading: boolean;
  error: unknown;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export const TrackerTableView = ({
  table,
  isLoading,
  error,
  globalFilter,
  setGlobalFilter,
}: TrackerTableViewProps) => (
  <Box className="flex flex-col gap-3">
    <Box className="flex items-center justify-between gap-3">
      <Input
        className="max-w-xs"
        placeholder={TRACKER_TABLE_COPY.searchPlaceholder}
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        aria-label={TRACKER_TABLE_COPY.searchLabel}
      />
      <ApplicationForm />
    </Box>
    {error ? <Text className="text-sm text-destructive">{messageForError(error)}</Text> : null}
    <DataTable
      table={table}
      isLoading={isLoading}
      loadingText={TRACKER_TABLE_COPY.loading}
      emptyText={TRACKER_TABLE_COPY.empty}
    />
  </Box>
);
