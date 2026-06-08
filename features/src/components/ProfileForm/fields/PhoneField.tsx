import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import type { Control } from 'react-hook-form';
import { FormField, FormItem, FormMessage, Input, Label } from '@apptly/ui';
import { PhoneCountrySelect } from '@apptly/features/components/ProfileForm/fields/PhoneCountrySelect';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import type { StringPath } from '@apptly/features/components/ProfileForm/fields/TextField';

export interface PhoneFieldProps {
  control: Control<ProfileFormValues>;
  name: StringPath;
  label: string;
}

/** Phone entry with a flag + calling-code picker (react-phone-number-input),
 * wired to react-hook-form via FormField. Emits an E.164 string. */
export const PhoneField = ({ control, name, label }: PhoneFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <Label htmlFor={name}>{label}</Label>
        <PhoneInput
          id={name}
          international
          defaultCountry="US"
          countryCallingCodeEditable={false}
          value={field.value || undefined}
          onChange={(next) => field.onChange(next ?? '')}
          onBlur={field.onBlur}
          inputComponent={Input}
          countrySelectComponent={PhoneCountrySelect}
          className="flex items-center gap-2"
        />
        <FormMessage />
      </FormItem>
    )}
  />
);
