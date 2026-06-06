import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type BoxOwnProps<T extends ElementType> = {
  /** The element/component to render. Defaults to `div`. */
  as?: T;
  className?: string;
  children?: ReactNode;
};

export type BoxProps<T extends ElementType = 'div'> = BoxOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof BoxOwnProps<T>>;

/**
 * Generic layout container. Replaces raw `div`/`header`/`main`/`section`
 * usage in app code so consumers only ever render components, never bare HTML.
 */
export const Box = <T extends ElementType = 'div'>({ as, className, ...props }: BoxProps<T>) => {
  const Component = (as ?? 'div') as ElementType;
  return <Component className={className} {...props} />;
};
