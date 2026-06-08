import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Box, Button, Form, FormRoot, Heading, Spinner } from '@apptly/ui';
import { PROFILE_FORM_COPY } from '@apptly/features/components/ProfileForm/copy';
import { CountryField } from '@apptly/features/components/ProfileForm/fields/CountryField';
import { PhoneField } from '@apptly/features/components/ProfileForm/fields/PhoneField';
import { TextField } from '@apptly/features/components/ProfileForm/fields/TextField';
import { TriField } from '@apptly/features/components/ProfileForm/fields/TriField';
import { ImportExport } from '@apptly/features/components/ProfileForm/ImportExport';
import { StructuredSections } from '@apptly/features/components/ProfileForm/StructuredSections';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';

export interface ProfileFormViewProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  isSaving: boolean;
}

const grid = 'grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2';
const sectionTitle = 'text-xs font-semibold uppercase tracking-wide text-muted-foreground';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Box as="section" className="flex flex-col gap-4">
    <Heading level={2} className={sectionTitle}>
      {title}
    </Heading>
    {children}
  </Box>
);

export const ProfileFormView = ({
  form,
  onSubmit,
  onExport,
  onImport,
  isSaving,
}: ProfileFormViewProps) => {
  const control = form.control;
  return (
    <Form {...form}>
      <FormRoot onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-8">
        <Box className="flex justify-end">
          <ImportExport onExport={onExport} onImport={onImport} />
        </Box>
        <Section title="Basics">
          <Box className={grid}>
            <TextField control={control} name="fullName" label="Full name" />
            <TextField control={control} name="email" label="Email" type="email" />
            <PhoneField control={control} name="phone" label="Phone" />
            <CountryField control={control} name="location" label="Country" />
          </Box>
        </Section>
        <Section title="Details">
          <Box className={grid}>
            <TextField control={control} name="city" label="City" />
            <TextField control={control} name="pronouns" label="Pronouns" placeholder="e.g. she/her" />
            <TextField control={control} name="currentTitle" label="Current title" />
            <TextField control={control} name="currentCompany" label="Current company" />
            <TextField control={control} name="yearsExperience" label="Years of experience" type="number" />
            <TextField control={control} name="desiredSalary" label="Desired salary" placeholder="e.g. €90k" />
            <TextField control={control} name="noticePeriod" label="Notice period" placeholder="e.g. 1 month" />
            <TriField control={control} name="willingToRelocate" label="Willing to relocate" />
            <TriField control={control} name="requiresSponsorship" label="Needs visa sponsorship" />
          </Box>
        </Section>
        <Section title="Links">
          <Box className="flex flex-col gap-4">
            <TextField control={control} name="linkedin" label="LinkedIn" type="url" placeholder="https://linkedin.com/in/you" />
            <TextField control={control} name="portfolio" label="Portfolio" type="url" placeholder="https://..." />
            <TextField control={control} name="github" label="GitHub" type="url" placeholder="https://github.com/you" />
          </Box>
        </Section>
        <StructuredSections control={control} />
        <Box>
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving ? <Spinner /> : null}
            {isSaving ? PROFILE_FORM_COPY.saving : PROFILE_FORM_COPY.save}
          </Button>
        </Box>
      </FormRoot>
    </Form>
  );
};
