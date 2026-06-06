import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRoot,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@apptly/ui';
import {
  APPLICATION_FORM_COPY,
  APPLICATION_STATUS_OPTIONS,
  APPLICATION_TEXT_FIELDS,
} from '@apptly/features/components/ApplicationForm/copy';
import type { ApplicationFormValues } from '@apptly/features/components/ApplicationForm/helpers';

export interface ApplicationFormViewProps {
  form: UseFormReturn<ApplicationFormValues>;
  onSubmit: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  isEdit: boolean;
  isSaving: boolean;
  trigger?: ReactNode;
}

export const ApplicationFormView = ({
  form,
  onSubmit,
  open,
  setOpen,
  isEdit,
  isSaving,
  trigger,
}: ApplicationFormViewProps) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      {trigger ?? (
        <Button>{isEdit ? APPLICATION_FORM_COPY.edit : APPLICATION_FORM_COPY.add}</Button>
      )}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? APPLICATION_FORM_COPY.edit : APPLICATION_FORM_COPY.add}</DialogTitle>
        <DialogDescription>{APPLICATION_FORM_COPY.description}</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <FormRoot onSubmit={onSubmit} className="grid gap-3">
          {APPLICATION_TEXT_FIELDS.map(({ name, label, type }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input type={type} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{APPLICATION_FORM_COPY.status}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={APPLICATION_FORM_COPY.status} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {APPLICATION_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{APPLICATION_FORM_COPY.notes}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? APPLICATION_FORM_COPY.saving
                : isEdit
                  ? APPLICATION_FORM_COPY.saveChanges
                  : APPLICATION_FORM_COPY.add}
            </Button>
          </DialogFooter>
        </FormRoot>
      </Form>
    </DialogContent>
  </Dialog>
);
