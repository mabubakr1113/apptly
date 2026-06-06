import { zodResolver } from '@hookform/resolvers/zod';
import type { ApplicationRecord } from '@apptly/shared';
import { toast } from '@apptly/ui';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import {
  useCreateApplication,
  useUpdateApplication,
} from '@apptly/features/lib/hooks/use-applications';
import {
  applicationFormSchema,
  EMPTY_APPLICATION_FORM,
  toCreate,
  toFormValues,
  toPatch,
  type ApplicationFormValues,
} from '@apptly/features/components/ApplicationForm/helpers';

type ApplicationFormOptions = {
  application?: ApplicationRecord;
  onSaved?: () => void;
};

export type ApplicationFormProps = {
  application?: ApplicationRecord;
  trigger?: ReactNode;
};

export const useApplicationForm = (options: ApplicationFormOptions) => {
  const { application, onSaved } = options;
  const isEdit = Boolean(application);
  const create = useCreateApplication();
  const update = useUpdateApplication();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: application ? toFormValues(application) : EMPTY_APPLICATION_FORM,
  });

  const onSubmit = form.handleSubmit((values) => {
    const done = {
      onSuccess: () => {
        toast.success(isEdit ? 'Application updated' : 'Application added');
        if (!isEdit) form.reset(EMPTY_APPLICATION_FORM);
        onSaved?.();
      },
    };
    if (application) {
      update.mutate({ params: { id: application.id }, body: toPatch(values) }, done);
    } else {
      create.mutate({ body: toCreate(values) }, done);
    }
  });

  return { form, onSubmit, isEdit, isSaving: create.isPending || update.isPending };
};

export const useApplicationFormModel = (props: { application?: ApplicationRecord }) => {
  const [open, setOpen] = useState(false);
  const formState = useApplicationForm({
    application: props.application,
    onSaved: () => setOpen(false),
  });
  return { ...formState, open, setOpen };
};
