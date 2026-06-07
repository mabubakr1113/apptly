import { SignUp } from '@clerk/nextjs';
import { Box } from '@apptly/ui';

const SignUpPage = () => (
  <Box as="main" className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
    <SignUp />
  </Box>
);

export default SignUpPage;
