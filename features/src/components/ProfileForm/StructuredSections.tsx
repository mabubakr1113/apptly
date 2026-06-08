import type { Control } from 'react-hook-form';
import { Box } from '@apptly/ui';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import { CustomQASection } from '@apptly/features/components/ProfileForm/fields/CustomQASection';
import { EducationSection } from '@apptly/features/components/ProfileForm/fields/EducationSection';
import { EeoSection } from '@apptly/features/components/ProfileForm/fields/EeoSection';
import { SkillsField } from '@apptly/features/components/ProfileForm/fields/SkillsField';
import { WorkHistorySection } from '@apptly/features/components/ProfileForm/fields/WorkHistorySection';

/** The Profile's repeatable / structured sections (work history, education,
 * skills, voluntary EEO, saved answers), grouped below the scalar fields. */
export const StructuredSections = ({ control }: { control: Control<ProfileFormValues> }) => (
  <Box className="flex flex-col gap-8">
    <WorkHistorySection control={control} />
    <EducationSection control={control} />
    <SkillsField control={control} />
    <CustomQASection control={control} />
    <EeoSection control={control} />
  </Box>
);
