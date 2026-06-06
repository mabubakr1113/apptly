import type { ComponentProps } from 'react';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = (props: ToasterProps) => <Sonner {...props} />;

export { Toaster, toast };
