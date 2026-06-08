import { getCountryCallingCode, type Country } from 'react-phone-number-input';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  cn,
} from '@apptly/ui';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { CountryFlag } from '@apptly/features/components/ProfileForm/fields/CountryFlag';

interface CountryOption {
  value?: Country;
  label: string;
}

export interface PhoneCountrySelectProps {
  value?: Country;
  onChange: (value?: Country) => void;
  options: CountryOption[];
  disabled?: boolean;
  readOnly?: boolean;
}

const callingCode = (country?: Country) => (country ? `+${getCountryCallingCode(country)}` : '');

/** Searchable flag dropdown plugged into react-phone-number-input via
 * `countrySelectComponent`. Renders the same UX as the location combobox. */
export const PhoneCountrySelect = ({
  value,
  onChange,
  options,
  disabled,
  readOnly,
}: PhoneCountrySelectProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || readOnly}
          aria-label="Select country calling code"
          className="h-9 shrink-0 gap-1 px-2"
        >
          <CountryFlag code={value} />
          <ChevronsUpDown className="size-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search country…" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value ?? 'ZZ'}
                  value={`${option.label} ${callingCode(option.value)}`}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <CountryFlag code={option.value} />
                  <Text as="span" className="flex-1">
                    {option.label}
                  </Text>
                  <Text as="span" className="text-muted-foreground">
                    {callingCode(option.value)}
                  </Text>
                  <Check className={cn('size-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
