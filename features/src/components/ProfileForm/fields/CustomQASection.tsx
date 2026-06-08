import { useFieldArray, type Control } from 'react-hook-form';
import { Box } from '@apptly/ui';
import { SECTION_COPY } from '@apptly/features/components/ProfileForm/copy';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import { Repeater } from '@apptly/features/components/ProfileForm/fields/Repeater';
import { TextField } from '@apptly/features/components/ProfileForm/fields/TextField';
import { TextareaField } from '@apptly/features/components/ProfileForm/fields/TextareaField';

const EMPTY = { question: '', answer: '' };

export const CustomQASection = ({ control }: { control: Control<ProfileFormValues> }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'customQA' });
  return (
    <Repeater
      title={SECTION_COPY.customQA.title}
      description={SECTION_COPY.customQA.description}
      rows={fields}
      addLabel={SECTION_COPY.customQA.add}
      emptyLabel={SECTION_COPY.customQA.empty}
      onAdd={() => append(EMPTY)}
      onRemove={remove}
      renderRow={(i) => (
        <Box className="flex flex-col gap-4">
          <TextField control={control} name={`customQA.${i}.question`} label="Question" />
          <TextareaField control={control} name={`customQA.${i}.answer`} label="Answer" />
        </Box>
      )}
    />
  );
};
