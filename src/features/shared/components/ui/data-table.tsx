import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '../../utils/styles';
import { EmptyMessage } from '../empty-message';
import { Button } from './button';
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/shared/components/ui/select';

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  rowCount?: number;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  getRowId?: (row: TData) => string;
  onRowClick?: (row: Row<TData>) => void;
  isPending?: boolean;
  FetchingRowsSkeleton: JSX.Element;
  enablePagination?: boolean;
  showSelectedRows?: boolean;
  className?: string;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  getRowId,
  onRowClick,
  isPending,
  FetchingRowsSkeleton,
  enablePagination = false,
  showSelectedRows = false,
  className,
}: DataTableProps<TData, TValue>) {
  'use no memo'; // https://github.com/TanStack/table/issues/5567

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    manualPagination: false,
    manualSorting: true,
    getRowId,
    pageCount: undefined,
  });

  return (
    <div className="space-y-4">
      <div className={className}>
        <Table>
          <TableHeader className="bg-muted">
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
                    className={cn('group', onRowClick && 'cursor-pointer')}
                    onClick={() => onRowClick?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            {isPending && FetchingRowsSkeleton}
          </TableBody>
        </Table>
      </div>
      {enablePagination && (
        <DataTablePagination
          table={table}
          showSelectedRows={showSelectedRows}
        />
      )}
    </div>
  );
}

interface DataTableEmptyStateProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
}

function DataTablePagination<TData>({
  table,
  paginationTypes = [5, 10, 20],
  showSelectedRows = false,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  paginationTypes?: Array<number>;
  showSelectedRows?: boolean;
}) {
  'use no memo';
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-2">
      {showSelectedRows && (
        <div className="flex-1 text-sm text-muted-foreground">
          {t('table.pagination.selected_rows', {
            count: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length,
          })}
        </div>
      )}
      <div className="flex items-center space-x-2">
        <p className="text-sm">{t('table.pagination.rows_per_page')}</p>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {paginationTypes.map((pageSize) => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm">
        {t('table.pagination.page_info', {
          page: table.getState().pagination.pageIndex + 1,
          totalPages: table.getPageCount(),
        })}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">
            {t('table.pagination.go_to_first_page')}
          </span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">
            {t('table.pagination.go_to_previous_page')}
          </span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">
            {t('table.pagination.go_to_next_page')}
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">
            {t('table.pagination.go_to_last_page')}
          </span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
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
