import type { UseFormReturn } from 'react-hook-form';
import {
  Box,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRoot,
  Input,
  Text,
} from '@apptly/ui';
import { messageForError } from '@apptly/features/lib/api/errors';
import { PROFILE_FIELDS, PROFILE_FORM_COPY } from '@apptly/features/components/ProfileForm/copy';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';

export interface ProfileFormViewProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: () => void;
  isLoading: boolean;
  loadError: unknown;
  isSaving: boolean;
}

export const ProfileFormView = ({
  form,
  onSubmit,
  isLoading,
  loadError,
  isSaving,
}: ProfileFormViewProps) => {
  if (isLoading)
    return <Text className="text-sm text-muted-foreground">{PROFILE_FORM_COPY.loading}</Text>;
  if (loadError)
    return <Text className="text-sm text-destructive">{messageForError(loadError)}</Text>;
  return (
    <Form {...form}>
      <FormRoot onSubmit={onSubmit} className="flex max-w-xl flex-col gap-4">
        {PROFILE_FIELDS.map(({ name, label, type, placeholder }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input type={type} placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Box>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? PROFILE_FORM_COPY.saving : PROFILE_FORM_COPY.save}
          </Button>
        </Box>
      </FormRoot>
    </Form>
  );
};
