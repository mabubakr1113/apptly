import { useFieldArray, type Control } from 'react-hook-form';
import { Box } from '@apptly/ui';
import { SECTION_COPY } from '@apptly/features/components/ProfileForm/copy';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import { Repeater } from '@apptly/features/components/ProfileForm/fields/Repeater';
import { TextField } from '@apptly/features/components/ProfileForm/fields/TextField';

const grid = 'grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2';
const EMPTY = { school: '', degree: '', field: '', start: '', end: '' };

export const EducationSection = ({ control }: { control: Control<ProfileFormValues> }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'education' });
  return (
    <Repeater
      title={SECTION_COPY.education.title}
      rows={fields}
      addLabel={SECTION_COPY.education.add}
      emptyLabel={SECTION_COPY.education.empty}
      onAdd={() => append(EMPTY)}
      onRemove={remove}
      renderRow={(i) => (
        <Box className={grid}>
          <TextField control={control} name={`education.${i}.school`} label="School" />
          <TextField control={control} name={`education.${i}.degree`} label="Degree" />
          <TextField control={control} name={`education.${i}.field`} label="Field of study" />
          <Box className="grid grid-cols-2 gap-x-5">
            <TextField control={control} name={`education.${i}.start`} label="Start" />
            <TextField control={control} name={`education.${i}.end`} label="End" />
          </Box>
        </Box>
      )}
    />
  );
};
