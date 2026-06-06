import { Box, Heading, Text } from '@apptly/ui';
import { EXTENSION_COPY } from '@apptly/extension/components/copy';

export const PopupApp = () => (
  <Box as="main" className="min-w-popup p-4">
    <Heading className="text-lg font-semibold">{EXTENSION_COPY.appName}</Heading>
    <Text className="mt-1 text-sm text-muted-foreground">{EXTENSION_COPY.tagline}</Text>
  </Box>
);
