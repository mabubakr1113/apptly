import { SignIn, SignUp } from '@clerk/chrome-extension';
import { Box, Button } from '@apptly/ui';
import { AuthMode } from '@apptly/extension/components/auth-helpers';
import { EXTENSION_COPY } from '@apptly/extension/components/copy';

export interface AuthScreenViewProps {
  mode: AuthMode;
  toggleMode: () => void;
  redirectUrl: string;
}

export const AuthScreenView = ({ mode, toggleMode, redirectUrl }: AuthScreenViewProps) => {
  const isSignIn = mode === AuthMode.SignIn;
  return (
    <Box className="flex min-w-auth flex-col items-center gap-3 p-4">
      {isSignIn ? (
        <SignIn routing="hash" fallbackRedirectUrl={redirectUrl} />
      ) : (
        <SignUp routing="hash" fallbackRedirectUrl={redirectUrl} />
      )}
      <Button variant="link" size="sm" onClick={toggleMode}>
        {isSignIn ? EXTENSION_COPY.signUp : EXTENSION_COPY.signIn}
      </Button>
    </Box>
  );
};
