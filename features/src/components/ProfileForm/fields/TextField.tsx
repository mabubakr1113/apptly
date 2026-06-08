import type { Control, FieldPathByValue } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@apptly/ui';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';

/** Paths in the form whose value is a (possibly optional) string. */
export type StringPath = FieldPathByValue<ProfileFormValues, string | undefined>;

export interface TextFieldProps {
  control: Control<ProfileFormValues>;
  name: StringPath;
  label: string;
  type?: 'text' | 'email' | 'url' | 'number';
  placeholder?: string;
}

/** A labelled text/email/url/number input wired to react-hook-form via FormField. */
export const TextField = ({ control, name, label, type = 'text', placeholder }: TextFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input type={type} placeholder={placeholder} {...field} value={field.value ?? ''} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
