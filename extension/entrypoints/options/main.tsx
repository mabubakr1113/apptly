import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthGate } from '../../components/AuthGate';
import '../../assets/styles.css';

function OptionsApp() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold">Apptly - Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Options page scaffold. Profile, documents, tracker, and settings land in later modules.
      </p>
    </main>
  );
}

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
