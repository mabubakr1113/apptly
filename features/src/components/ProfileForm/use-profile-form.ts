import { zodResolver } from '@hookform/resolvers/zod';
import type { Profile } from '@apptly/shared';
import { toast } from '@apptly/ui';
import { useForm } from 'react-hook-form';
import { useUpdateProfile } from '@apptly/features/lib/hooks/use-profile';
import { profileFormSchema, type ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import { toFormValues, toProfile } from '@apptly/features/components/ProfileForm/mappers';
import { downloadProfileJson, readProfileJson } from '@apptly/features/components/ProfileForm/io';

/**
 * Drives the profile form. The form is created with the loaded profile as its
 * `defaultValues` (the container only mounts this once the profile has loaded),
 * so every field — including controlled Radix Selects — initialises with the
 * right value. Hydrating via a post-mount `reset` instead races the controlled
 * Selects in a large form and leaves them blank.
 */
export const useProfileForm = (profile: Profile | null) => {
  const mutation = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: toFormValues(profile),
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      { body: toProfile(values, profile) },
      { onSuccess: () => toast.success('Profile saved') },
    );
  });

  const onExport = () => {
    try {
      downloadProfileJson(toProfile(form.getValues(), profile));
    } catch {
      toast.error('Fill in your name and email before exporting.');
    }
  };

  const onImport = async (file: File) => {
    try {
      form.reset(toFormValues(await readProfileJson(file)));
      toast.success('Profile imported — review and save to keep it.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not import that file.');
    }
  };

  return { form, onSubmit, onExport, onImport, isSaving: mutation.isPending };
};
