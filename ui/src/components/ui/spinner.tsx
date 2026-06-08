import { Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

/** Spinning loader icon for pending/loading states. */
export const Spinner = ({ className, ...props }: ComponentProps<typeof Loader2>) => (
  <Loader2 className={cn('size-4 animate-spin', className)} aria-hidden {...props} />
);
