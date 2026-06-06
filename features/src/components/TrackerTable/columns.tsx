import type { ApplicationRecord } from '@apptly/shared';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge, Box, Button, Text } from '@apptly/ui';
import { Trash2 } from 'lucide-react';
import { ApplicationForm } from '@apptly/features/components/ApplicationForm';
import { TRACKER_TABLE_COPY } from '@apptly/features/components/TrackerTable/copy';
import { statusBadgeVariant } from '@apptly/features/components/TrackerTable/helpers';

const RowActions = ({
  application,
  isDeleting,
  onDelete,
}: {
  application: ApplicationRecord;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}) => (
  <Box className="flex justify-end gap-1">
    <ApplicationForm
      application={application}
      trigger={
        <Button variant="ghost" size="sm">
          {TRACKER_TABLE_COPY.edit}
        </Button>
      }
    />
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Delete ${application.company} application`}
      disabled={isDeleting}
      onClick={() => onDelete(application.id)}
    >
      <Trash2 />
    </Button>
  </Box>
);

export const createApplicationColumns = (
  onDelete: (id: string) => void,
  isDeleting: boolean,
): ColumnDef<ApplicationRecord>[] => [
  { accessorKey: 'company', header: TRACKER_TABLE_COPY.headers.company },
  { accessorKey: 'position', header: TRACKER_TABLE_COPY.headers.position },
  {
    accessorKey: 'status',
    header: TRACKER_TABLE_COPY.headers.status,
    cell: ({ row }) => (
      <Badge variant={statusBadgeVariant(row.original.status)} className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'location',
    header: TRACKER_TABLE_COPY.headers.location,
    cell: ({ row }) => row.original.location ?? '-',
  },
  {
    accessorKey: 'dateApplied',
    header: TRACKER_TABLE_COPY.headers.applied,
    cell: ({ row }) => row.original.dateApplied ?? '-',
  },
  {
    id: 'actions',
    header: () => (
      <Text as="span" className="sr-only">
        {TRACKER_TABLE_COPY.headers.actions}
      </Text>
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <RowActions application={row.original} isDeleting={isDeleting} onDelete={onDelete} />
    ),
  },
];
