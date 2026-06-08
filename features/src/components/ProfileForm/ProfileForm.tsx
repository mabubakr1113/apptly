import type { Profile } from '@apptly/shared';
import { Box, Spinner, Text } from '@apptly/ui';
import { useProfile } from '@apptly/features/lib/hooks/use-profile';
import { messageForError } from '@apptly/features/lib/api/errors';
import { PROFILE_FORM_COPY } from '@apptly/features/components/ProfileForm/copy';
import { ProfileFormView } from '@apptly/features/components/ProfileForm/ProfileForm.view';
import { useProfileForm } from '@apptly/features/components/ProfileForm/use-profile-form';

// Mounts only once the profile has loaded, so the form initialises its fields
// (including controlled Selects) from real data instead of resetting after mount.
const ProfileFormBody = ({ profile }: { profile: Profile | null }) => (
  <ProfileFormView {...useProfileForm(profile)} />
);

export const ProfileForm = () => {
  const query = useProfile();

  if (query.isLoading)
    return (
      <Box className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner /> {PROFILE_FORM_COPY.loading}
      </Box>
    );
  if (query.error)
    return <Text className="text-sm text-destructive">{messageForError(query.error)}</Text>;

  return <ProfileFormBody profile={query.data ?? null} />;
};
