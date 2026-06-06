import { AppDataProvider, ProfileForm } from '@apptly/features';
import { useAuth } from '@clerk/chrome-extension';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Box, Heading, Text } from '@apptly/ui';
import { AuthGate } from '@apptly/extension/components/AuthGate';
import '../../assets/styles.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

const OptionsApp = () => {
  const { getToken } = useAuth();

  if (!baseUrl) {
    return (
      <Box as="main" className="mx-auto max-w-3xl p-6">
        <Heading className="text-xl font-semibold">Apptly - Settings</Heading>
        <Text className="mt-6 text-sm text-destructive">
          Missing <Text as="code">VITE_API_BASE_URL</Text>. Add it to{' '}
          <Text as="code">extension/.env</Text> (see <Text as="code">extension/.env.example</Text>).
        </Text>
      </Box>
    );
  }

  return (
    <AppDataProvider getToken={getToken} baseUrl={baseUrl}>
      <Box as="main" className="mx-auto max-w-3xl p-6">
        <Heading className="text-xl font-semibold">Apptly - Settings</Heading>
        <Box as="section" className="mt-6">
          <Heading level={2} className="text-base font-semibold">
            Profile
          </Heading>
          <Text className="mb-4 mt-1 text-sm text-muted-foreground">
            Synced to your account. Documents, tracker, and settings land in later modules.
          </Text>
          <ProfileForm />
        </Box>
      </Box>
    </AppDataProvider>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <AuthGate>
        <OptionsApp />
      </AuthGate>
    </StrictMode>,
  );
}
