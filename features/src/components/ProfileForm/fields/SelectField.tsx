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
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import type { StringPath } from '@apptly/features/components/ProfileForm/fields/TextField';

export interface SelectFieldProps {
  control: Control<ProfileFormValues>;
  name: StringPath;
  label: string;
  options: readonly { value: string; label: string }[];
}

/** A labelled single-choice select (fixed options) wired to react-hook-form. */
export const SelectField = ({ control, name, label, options }: SelectFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select value={field.value ?? ''} onValueChange={field.onChange}>
          <FormControl>
            <SelectTrigger>
              {/* Render the label from options, not Radix's item lookup: a
                  programmatically-set value (RHF reset on load) has no mounted
                  item for Radix to read, so SelectValue would otherwise be blank. */}
              <SelectValue>{options.find((o) => o.value === field.value)?.label}</SelectValue>
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
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
