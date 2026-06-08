import { SignIn } from '@clerk/nextjs';
import { Box } from '@apptly/ui';

const SignInPage = () => (
  <Box as="main" className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
    <SignIn />
  </Box>
);

export default SignInPage;
