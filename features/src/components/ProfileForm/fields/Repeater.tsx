import type { ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Box, Button, Heading, Text } from '@apptly/ui';

export interface RepeaterProps {
  title: string;
  description?: string;
  /** Stable `useFieldArray` rows (each carries an `id`). */
  rows: { id: string }[];
  addLabel: string;
  emptyLabel: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderRow: (index: number) => ReactNode;
}

const sectionTitle = 'text-xs font-semibold uppercase tracking-wide text-muted-foreground';

/** Generic add/remove field-array section. Each row is rendered by `renderRow`
 * and gets a Remove control; an Add button appends a new (blank) row. */
export const Repeater = ({
  title,
  description,
  rows,
  addLabel,
  emptyLabel,
  onAdd,
  onRemove,
  renderRow,
}: RepeaterProps) => (
  <Box as="section" className="flex flex-col gap-4">
    <Box className="flex flex-col gap-1">
      <Heading level={2} className={sectionTitle}>
        {title}
      </Heading>
      {description ? (
        <Text className="text-sm text-muted-foreground">{description}</Text>
      ) : null}
    </Box>

    {rows.length === 0 ? (
      <Text className="text-sm text-muted-foreground">{emptyLabel}</Text>
    ) : null}

    {rows.map((row, index) => (
      <Box key={row.id} className="relative rounded-md border bg-card p-4 pr-12">
        {renderRow(index)}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Remove ${title} entry ${index + 1}`}
          className="absolute right-2 top-2"
          onClick={() => onRemove(index)}
        >
          <Trash2 />
        </Button>
      </Box>
    ))}

    <Box>
      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={onAdd}>
        <Plus className="size-4" /> {addLabel}
      </Button>
    </Box>
  </Box>
);
