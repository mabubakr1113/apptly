import { flexRender, type Table as TableInstance } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@apptly/ui';
import { DATA_TABLE_SORT_MARKS } from '@apptly/features/components/DataTable/copy';

export interface RenderDataTableProps<TData> {
  table: TableInstance<TData>;
  isLoading?: boolean;
  loadingText: string;
  emptyText: string;
}

const sortMark = (value: false | 'asc' | 'desc') => (value ? DATA_TABLE_SORT_MARKS[value] : '');

export const renderDataTable = <TData,>({
  table,
  isLoading = false,
  loadingText,
  emptyText,
}: RenderDataTableProps<TData>) => (
  <Table>
    <TableHeader>
      {table.getHeaderGroups().map((group) => (
        <TableRow key={group.id}>
          {group.headers.map((header) => (
            <TableHead
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              className={header.column.getCanSort() ? 'cursor-pointer select-none' : undefined}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {sortMark(header.column.getIsSorted())}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
    <TableBody>
      {table.getRowModel().rows.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={table.getAllLeafColumns().length}
            className="h-24 text-center text-muted-foreground"
          >
            {isLoading ? loadingText : emptyText}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);
