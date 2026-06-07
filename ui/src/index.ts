// These are interactive client components (Radix + hooks/context). The directive
// marks them as a Client Component boundary for React Server Components consumers
// (the Next.js web app); Vite/WXT (the extension) treat it as a harmless no-op.
'use client';

// Utilities
export { cn } from './lib/cn';

// Layout / typography primitives (used instead of raw HTML in app code).
export { Box, type BoxProps } from './components/layout/Box';
export { Text, type TextProps } from './components/layout/Text';
export { Heading, type HeadingProps } from './components/layout/Heading';
export { FormRoot, type FormRootProps } from './components/layout/FormRoot';

// Generic UI primitives.
export { Badge, badgeVariants } from './components/ui/badge';
export { Button, buttonVariants } from './components/ui/button';
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from './components/ui/form';
export { Input } from './components/ui/input';
export { Label } from './components/ui/label';
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
export { Toaster, toast } from './components/ui/sonner';
export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
export { Textarea } from './components/ui/textarea';
