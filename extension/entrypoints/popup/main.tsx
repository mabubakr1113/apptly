import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthGate } from '@apptly/extension/components/AuthGate';
import { PopupApp } from '@apptly/extension/components/PopupApp';
import '../../assets/styles.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <AuthGate>
        <PopupApp />
      </AuthGate>
    </StrictMode>,
  );
}
