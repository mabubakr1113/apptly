import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type TextElement = 'p' | 'span' | 'code' | 'small';

export type TextProps<T extends TextElement = 'p'> = {
  /** The inline/text element to render. Defaults to `p`. */
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

/** Text/inline primitive. Replaces raw `p`/`span`/`code` usage in app code. */
export const Text = <T extends TextElement = 'p'>({ as, className, ...props }: TextProps<T>) => {
  const Component = (as ?? 'p') as TextElement;
  return <Component className={className} {...props} />;
};
