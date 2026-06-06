import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Box, Heading, Text } from '@apptly/ui';
import { AuthGate } from '@apptly/extension/components/AuthGate';
import '../../assets/styles.css';

const SidePanelApp = () => (
  <Box as="main" className="p-4">
    <Heading className="text-lg font-semibold">Apptly</Heading>
    <Text className="mt-1 text-sm text-muted-foreground">
      Side panel scaffold. The Analyze &amp; Fill flow arrives in Module 9.
    </Text>
  </Box>
);

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
