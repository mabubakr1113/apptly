import flags from 'react-phone-number-input/flags';
import { Globe } from 'lucide-react';
import type { FC } from 'react';
import { Box } from '@apptly/ui';

export interface CountryFlagProps {
  /** ISO-3166 alpha-2 code, e.g. `US`. Omit for the "international" globe. */
  code?: string;
  className?: string;
}

/** Renders a country's flag (from react-phone-number-input's bundled SVGs), or a
 * globe when no/unknown country is given. */
export const CountryFlag = ({ code, className = 'w-5' }: CountryFlagProps) => {
  const Flag = code ? (flags as Record<string, FC<{ title?: string }>>)[code] : undefined;
  if (!Flag) return <Globe className={className} aria-hidden />;
  return (
    <Box className={`${className} shrink-0 overflow-hidden rounded-sm`}>
      <Flag title={code} />
    </Box>
  );
};
