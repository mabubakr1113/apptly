import { AuthScreenView } from '@apptly/extension/components/AuthScreen.view';
import { useAuthScreen } from '@apptly/extension/components/auth-helpers';

export const AuthScreen = () => <AuthScreenView {...useAuthScreen()} />;
