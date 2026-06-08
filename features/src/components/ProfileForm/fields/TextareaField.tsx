import type { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Textarea } from '@apptly/ui';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import type { StringPath } from '@apptly/features/components/ProfileForm/fields/TextField';

export interface TextareaFieldProps {
  control: Control<ProfileFormValues>;
  name: StringPath;
  label: string;
  placeholder?: string;
}

/** A labelled multi-line text input wired to react-hook-form via FormField. */
export const TextareaField = ({ control, name, label, placeholder }: TextareaFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea rows={3} placeholder={placeholder} {...field} value={field.value ?? ''} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
