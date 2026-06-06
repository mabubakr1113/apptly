import { ApplicationFormView } from '@apptly/features/components/ApplicationForm/ApplicationForm.view';
import {
  useApplicationFormModel,
  type ApplicationFormProps,
} from '@apptly/features/components/ApplicationForm/use-application-form';

export const ApplicationForm = ({ application, trigger }: ApplicationFormProps) => (
  <ApplicationFormView trigger={trigger} {...useApplicationFormModel({ application })} />
);
