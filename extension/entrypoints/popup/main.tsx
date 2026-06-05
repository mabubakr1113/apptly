import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthGate } from '../../components/AuthGate';
import { PopupApp } from '../../components/PopupApp';
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
