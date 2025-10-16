import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/styles';
import { EmptyMessage } from '../empty-message';
import type {
  ColumnDef,
  OnChangeFn,
  Row,
  SortingState,
} from '@tanstack/react-table';
import type { JSX } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  rowCount?: number;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  getRowId?: (row: TData) => string;
  onRowClick?: (row: Row<TData>) => void;
  isPending?: boolean;
  FetchingRowsSkeleton: JSX.Element;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sorting,
  onSortingChange,
  getRowId,
  onRowClick,
  isPending,
  FetchingRowsSkeleton,
}: DataTableProps<TData, TValue>) {
  'use no memo'; // https://github.com/TanStack/table/issues/5567

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    getRowId,
  });

  return (
    <Table className="rounded-md border">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {!table.getRowModel().rows.length
          ? !isPending && <DataTableEmptyState columns={columns} />
          : table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cn(onRowClick && 'cursor-pointer')}
                onClick={() => onRowClick?.(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        {isPending && FetchingRowsSkeleton}
      </TableBody>
    </Table>
  );
}

interface DataTableEmptyStateProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
}

function DataTableEmptyState<TData, TValue>({
  columns,
}: DataTableEmptyStateProps<TData, TValue>) {
  const { t } = useTranslation();
  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        <EmptyMessage message={t('instruments.no_instruments_found')} />
      </TableCell>
    </TableRow>
  );
}
