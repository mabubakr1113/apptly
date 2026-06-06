import { ProfileFormView } from '@apptly/features/components/ProfileForm/ProfileForm.view';
import { useProfileForm } from '@apptly/features/components/ProfileForm/use-profile-form';

export const ProfileForm = () => <ProfileFormView {...useProfileForm()} />;
