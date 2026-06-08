import type { Control } from 'react-hook-form';
import { Box, Heading, Text } from '@apptly/ui';
import {
  DISABILITY_OPTIONS,
  GENDER_OPTIONS,
  RACE_OPTIONS,
  SECTION_COPY,
  VETERAN_OPTIONS,
} from '@apptly/features/components/ProfileForm/copy';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import { SelectField } from '@apptly/features/components/ProfileForm/fields/SelectField';

const grid = 'grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2';
const sectionTitle = 'text-xs font-semibold uppercase tracking-wide text-muted-foreground';

/** Voluntary EEO answers. Default is decline-to-answer and these are never
 * auto-filled into application forms — the user shares them deliberately. */
export const EeoSection = ({ control }: { control: Control<ProfileFormValues> }) => (
  <Box as="section" className="flex flex-col gap-4">
    <Box className="flex flex-col gap-1">
      <Heading level={2} className={sectionTitle}>
        {SECTION_COPY.eeo.title}
      </Heading>
      <Text className="text-sm text-muted-foreground">{SECTION_COPY.eeo.description}</Text>
    </Box>
    <Box className={grid}>
      <SelectField control={control} name="eeo.gender" label="Gender" options={GENDER_OPTIONS} />
      <SelectField
        control={control}
        name="eeo.race"
        label="Race / ethnicity"
        options={RACE_OPTIONS}
      />
      <SelectField
        control={control}
        name="eeo.veteranStatus"
        label="Veteran status"
        options={VETERAN_OPTIONS}
      />
      <SelectField
        control={control}
        name="eeo.disabilityStatus"
        label="Disability status"
        options={DISABILITY_OPTIONS}
      />
    </Box>
  </Box>
);
