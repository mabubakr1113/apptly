export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatDate = (value: string): string => new Date(value).toLocaleDateString();

/** PDFs can render inline in the preview; other types (DOCX) offer download. */
export const isPdf = (filename: string): boolean => filename.toLowerCase().endsWith('.pdf');
