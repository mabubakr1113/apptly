import type { Control } from 'react-hook-form';
import { FormField, FormItem, FormMessage, Label } from '@apptly/ui';
import { PROFILE_FORM_COPY } from '@apptly/features/components/ProfileForm/copy';
import { CountryCombobox } from '@apptly/features/components/ProfileForm/fields/CountryCombobox';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import type { StringPath } from '@apptly/features/components/ProfileForm/fields/TextField';

export interface CountryFieldProps {
  control: Control<ProfileFormValues>;
  name: StringPath;
  label: string;
}

/** Searchable country dropdown (flag + name) wired to react-hook-form. */
export const CountryField = ({ control, name, label }: CountryFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <Label htmlFor={name}>{label}</Label>
        <CountryCombobox
          id={name}
          value={field.value ?? ''}
          onChange={field.onChange}
          placeholder={PROFILE_FORM_COPY.selectPlaceholder}
        />
        <FormMessage />
      </FormItem>
    )}
  />
);
