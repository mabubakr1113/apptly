import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@apptly/ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile, useUpdateProfile } from '@apptly/features/lib/hooks/use-profile';
import {
  EMPTY_PROFILE_FORM,
  profileFormSchema,
  toFormValues,
  toProfile,
  type ProfileFormValues,
} from '@apptly/features/components/ProfileForm/helpers';

export const useProfileForm = () => {
  const query = useProfile();
  const mutation = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: EMPTY_PROFILE_FORM,
  });

  // Hydrate the form once the profile loads (reset keeps it pristine).
  const { reset } = form;
  useEffect(() => {
    if (query.data !== undefined) reset(toFormValues(query.data));
  }, [query.data, reset]);

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      { body: toProfile(values, query.data ?? null) },
      {
        onSuccess: () => toast.success('Profile saved'),
      },
    );
  });

  return {
    form,
    onSubmit,
    isLoading: query.isLoading,
    loadError: query.error,
    isSaving: mutation.isPending,
  };
};
