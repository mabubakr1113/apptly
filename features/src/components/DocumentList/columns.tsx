import type { ColumnDef } from '@tanstack/react-table';
import type { DocumentMeta } from '@apptly/shared';
import { Badge, Box, Button, Text } from '@apptly/ui';
import { Eye, Trash2 } from 'lucide-react';
import {
  DOCUMENT_KIND_LABELS,
  DOCUMENT_LIST_COPY,
} from '@apptly/features/components/DocumentList/copy';
import { formatBytes, formatDate } from '@apptly/features/components/DocumentList/helpers';

export const createDocumentColumns = (
  onPreview: (doc: DocumentMeta) => void,
  onDelete: (doc: DocumentMeta) => void,
): ColumnDef<DocumentMeta>[] => [
  {
    accessorKey: 'kind',
    header: DOCUMENT_LIST_COPY.headers.kind,
    cell: ({ row }) => <Badge variant="secondary">{DOCUMENT_KIND_LABELS[row.original.kind]}</Badge>,
  },
  {
    accessorKey: 'filename',
    header: DOCUMENT_LIST_COPY.headers.file,
    cell: ({ row }) => (
      <Text as="span" className="block max-w-filename truncate">
        {row.original.filename}
      </Text>
    ),
  },
  {
    accessorKey: 'size',
    header: DOCUMENT_LIST_COPY.headers.size,
    cell: ({ row }) => formatBytes(row.original.size),
  },
  {
    accessorKey: 'createdAt',
    header: DOCUMENT_LIST_COPY.headers.uploaded,
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: 'actions',
    header: () => (
      <Text as="span" className="sr-only">
        {DOCUMENT_LIST_COPY.headers.actions}
      </Text>
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <Box className="flex justify-end gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Preview ${row.original.filename}`}
          onClick={() => onPreview(row.original)}
        >
          <Eye />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Delete ${row.original.filename}`}
          onClick={() => onDelete(row.original)}
        >
          <Trash2 />
        </Button>
      </Box>
    ),
  },
];
