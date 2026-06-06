import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = {
  /** Heading level (`h1`–`h6`). Defaults to `1`. */
  level?: HeadingLevel;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'h1'>, 'className' | 'children'>;

/** Heading primitive. Replaces raw `h1`–`h6` usage in app code. */
export const Heading = ({ level = 1, className, ...props }: HeadingProps) => {
  const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return <Component className={className} {...props} />;
};
