import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthGate } from '../../components/AuthGate';
import '../../assets/styles.css';

function SidePanelApp() {
  return (
    <main className="p-4">
      <h1 className="text-lg font-semibold">Apptly</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Side panel scaffold. The Analyze &amp; Fill flow arrives in Module 9.
      </p>
    </main>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <AuthGate>
        <SidePanelApp />
      </AuthGate>
    </StrictMode>,
  );
}
