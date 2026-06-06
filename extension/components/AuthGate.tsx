import type { ReactNode } from 'react';
import { AuthGateView } from '@apptly/extension/components/AuthGate.view';
import { getPublishableKey } from '@apptly/extension/components/auth-helpers';

export const AuthGate = ({ children }: { children: ReactNode }) => (
  <AuthGateView publishableKey={getPublishableKey()}>{children}</AuthGateView>
);
