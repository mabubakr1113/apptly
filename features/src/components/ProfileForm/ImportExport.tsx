import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { Box, Button, Input } from '@apptly/ui';

export interface ImportExportProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

/** Profile data portability: export the profile as JSON, or import one back in. */
export const ImportExport = ({ onExport, onImport }: ImportExportProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <Box className="flex gap-2">
      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={onExport}>
        <Download className="size-4" /> Export
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="size-4" /> Import
      </Button>
      <Input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-label="Import profile JSON"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onImport(file);
          event.target.value = '';
        }}
      />
    </Box>
  );
};
