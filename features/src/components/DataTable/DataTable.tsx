import {
  renderDataTable,
  type RenderDataTableProps,
} from '@apptly/features/components/DataTable/render';

export type DataTableProps<TData> = RenderDataTableProps<TData>;

export const DataTable = <TData,>(props: DataTableProps<TData>) => renderDataTable(props);
