import type { ReactNode } from 'react';
import { Box, Heading, Text } from '@apptly/ui';

export interface PageHeaderProps {
  title: string;
  description: ReactNode;
}

/** Shared dashboard page heading (title + supporting copy). Pure UI. */
export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <Box as="header">
    <Heading className="text-2xl font-semibold tracking-tight">{title}</Heading>
    <Text className="mt-1 text-sm text-muted-foreground">{description}</Text>
  </Box>
);
