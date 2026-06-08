import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';

export type FrameProps = ComponentPropsWithoutRef<'iframe'> & {
  /** Required for accessibility — describes the embedded content. */
  title: string;
};

/**
 * `<iframe>` wrapper for embedding self-hosted content (e.g. a PDF preview from a
 * `blob:` URL). Lives in `@apptly/ui` so app code never renders a raw `iframe`.
 * `sandbox` is opt-in (omitted by default so the browser's PDF viewer can render).
 */
export const Frame = ({ className, title, sandbox, ...props }: FrameProps) => (
  <iframe
    title={title}
    sandbox={sandbox}
    className={cn('h-full w-full border-0', className)}
    {...props}
  />
);
