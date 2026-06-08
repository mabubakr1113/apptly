import { useFieldArray, type Control } from 'react-hook-form';
import { Box } from '@apptly/ui';
import { SECTION_COPY } from '@apptly/features/components/ProfileForm/copy';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import { Repeater } from '@apptly/features/components/ProfileForm/fields/Repeater';
import { TextField } from '@apptly/features/components/ProfileForm/fields/TextField';
import { TextareaField } from '@apptly/features/components/ProfileForm/fields/TextareaField';

const grid = 'grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2';
const EMPTY = { company: '', title: '', start: '', end: '', summary: '' };

export const WorkHistorySection = ({ control }: { control: Control<ProfileFormValues> }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'workHistory' });
  return (
    <Repeater
      title={SECTION_COPY.workHistory.title}
      rows={fields}
      addLabel={SECTION_COPY.workHistory.add}
      emptyLabel={SECTION_COPY.workHistory.empty}
      onAdd={() => append(EMPTY)}
      onRemove={remove}
      renderRow={(i) => (
        <Box className="flex flex-col gap-4">
          <Box className={grid}>
            <TextField control={control} name={`workHistory.${i}.company`} label="Company" />
            <TextField control={control} name={`workHistory.${i}.title`} label="Title" />
            <TextField
              control={control}
              name={`workHistory.${i}.start`}
              label="Start"
              placeholder="e.g. 2021-03"
            />
            <TextField
              control={control}
              name={`workHistory.${i}.end`}
              label="End"
              placeholder="e.g. Present"
            />
          </Box>
          <TextareaField control={control} name={`workHistory.${i}.summary`} label="Summary" />
        </Box>
      )}
    />
  );
};
