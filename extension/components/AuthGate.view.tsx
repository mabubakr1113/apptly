import { ClerkProvider, useAuth, UserButton } from '@clerk/chrome-extension';
import type { ReactNode } from 'react';
import { Box, Heading, Text } from '@apptly/ui';
import { AuthScreen } from '@apptly/extension/components/AuthScreen';
import { EXTENSION_COPY, clerkAppearance } from '@apptly/extension/components/copy';

const GatedContent = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded)
    return <Box className="p-4 text-sm text-muted-foreground">{EXTENSION_COPY.loading}</Box>;
  if (!isSignedIn) return <AuthScreen />;
  return (
    <>
      <Box as="header" className="flex justify-end p-2">
        <UserButton />
      </Box>
      {children}
    </>
  );
};

export const AuthGateView = ({
  children,
  publishableKey,
}: {
  children: ReactNode;
  publishableKey?: string;
}) =>
  publishableKey ? (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/" appearance={clerkAppearance}>
      <GatedContent>{children}</GatedContent>
    </ClerkProvider>
  ) : (
    <Box className="min-w-panel p-4">
      <Heading className="text-base font-semibold">{EXTENSION_COPY.appName}</Heading>
      <Text className="mt-1 text-sm text-destructive">
        {EXTENSION_COPY.missingKey} <Text as="code">{EXTENSION_COPY.clerkKey}</Text>.{' '}
        {EXTENSION_COPY.missingKeyHelp}
      </Text>
    </Box>
  );
