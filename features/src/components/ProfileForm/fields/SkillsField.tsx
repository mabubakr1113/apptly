import { useState, type KeyboardEvent } from 'react';
import { useFieldArray, type Control } from 'react-hook-form';
import { X } from 'lucide-react';
import { Badge, Box, Button, Heading, Input, Text } from '@apptly/ui';
import { SECTION_COPY } from '@apptly/features/components/ProfileForm/copy';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';

const sectionTitle = 'text-xs font-semibold uppercase tracking-wide text-muted-foreground';

/** Tag-style skills editor: type + Enter to add a chip, click ✕ to remove. */
export const SkillsField = ({ control }: { control: Control<ProfileFormValues> }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });
  const [draft, setDraft] = useState('');

  const add = () => {
    const value = draft.trim();
    if (!value || fields.some((f) => f.value.toLowerCase() === value.toLowerCase())) return;
    append({ value });
    setDraft('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add();
    }
  };

  return (
    <Box as="section" className="flex flex-col gap-4">
      <Heading level={2} className={sectionTitle}>
        {SECTION_COPY.skills.title}
      </Heading>
      {fields.length === 0 ? (
        <Text className="text-sm text-muted-foreground">{SECTION_COPY.skills.empty}</Text>
      ) : (
        <Box className="flex flex-wrap gap-2">
          {fields.map((field, index) => (
            <Badge key={field.id} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1">
              {field.value}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${field.value}`}
                className="size-4 rounded-full p-0 hover:bg-transparent hover:text-destructive"
                onClick={() => remove(index)}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          ))}
        </Box>
      )}
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
        placeholder={SECTION_COPY.skills.placeholder}
        className="max-w-sm"
        aria-label="Add a skill"
      />
    </Box>
  );
};
