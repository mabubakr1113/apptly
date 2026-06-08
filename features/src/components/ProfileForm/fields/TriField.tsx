import type { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@apptly/ui';
import { PROFILE_FORM_COPY, TRI_OPTIONS } from '@apptly/features/components/ProfileForm/copy';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import type { StringPath } from '@apptly/features/components/ProfileForm/fields/TextField';

export interface TriFieldProps {
  control: Control<ProfileFormValues>;
  name: StringPath;
  label: string;
}

/** A Yes/No (tri-state, unset = placeholder) select wired to react-hook-form. */
export const TriField = ({ control, name, label }: TriFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select value={field.value ?? ''} onValueChange={field.onChange}>
          <FormControl>
            <SelectTrigger>
              {/* Label comes from options, not Radix's mounted-item lookup, so a
                  value set via RHF reset (on load) still renders (Radix would
                  otherwise leave the trigger blank until the menu is opened). */}
              <SelectValue placeholder={PROFILE_FORM_COPY.selectPlaceholder}>
                {TRI_OPTIONS.find((o) => o.value === field.value)?.label}
              </SelectValue>
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {TRI_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);
