import type { ComponentPropsWithoutRef } from 'react';

export type FormRootProps = ComponentPropsWithoutRef<'form'>;

/**
 * Native `form` element wrapper. The shadcn `Form` export is the
 * react-hook-form context provider; `FormRoot` is the actual `<form>` so app
 * code can render a form without touching raw HTML.
 */
export const FormRoot = (props: FormRootProps) => <form {...props} />;
