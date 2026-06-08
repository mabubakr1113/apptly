import {
  Box,
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
import { COUNTRIES } from '@apptly/features/components/ProfileForm/countries';
import { CountryFlag } from '@apptly/features/components/ProfileForm/fields/CountryFlag';

export interface CountryComboboxProps {
  id?: string;
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
}

/** Searchable country picker (flag + name) for the location field. Stores the name. */
export const CountryCombobox = ({ id, value, onChange, placeholder }: CountryComboboxProps) => {
  const [open, setOpen] = useState(false);
  const selected = COUNTRIES.find((country) => country.name === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selected ? (
            <Box className="flex items-center gap-2">
              <CountryFlag code={selected.code} />
              {selected.name}
            </Box>
          ) : (
            <Text as="span" className="text-muted-foreground">
              {placeholder}
            </Text>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search country…" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={() => {
                    onChange(country.name);
                    setOpen(false);
                  }}
                >
                  <CountryFlag code={country.code} />
                  <Text as="span" className="flex-1">
                    {country.name}
                  </Text>
                  <Check className={cn('size-4', value === country.name ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
