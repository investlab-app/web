import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { useState } from 'react';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import type { HistoryEntry } from '@/client';
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipTrigger,
} from '@/features/shared/components/ui/hybrid-tooltip';
import { dateToLocale } from '@/features/shared/utils/date';
import { Badge } from '@/features/shared/components/ui/badge';
import { DataTable } from '@/features/shared/components/ui/data-table';
import { TableCell, TableRow } from '@/features/shared/components/ui/table';
import { withCurrency } from '@/features/shared/utils/numbers';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { cn } from '@/features/shared/utils/styles';

function usePositionsColumns() {
  const { t, i18n } = useTranslation();

  return new Array<ColumnDef<HistoryEntry>>(
    {
      accessorKey: 'timestamp',
      header: () => (
        <div className="flex items-center gap-1">
          <span>{t('transactions.table.headers.transaction')}</span>
          <HybridTooltip>
            <HybridTooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </HybridTooltipTrigger>
            <HybridTooltipContent>
              <p>{t('transactions.tooltips.transaction')}</p>
            </HybridTooltipContent>
          </HybridTooltip>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge
            aria-label={dateToLocale(row.original.timestamp, i18n.language)}
            title={row.original.timestamp}
            variant="secondary"
            className="min-w-24"
          >
            {dateToLocale(row.original.timestamp, i18n.language)}
          </Badge>
          <Badge variant="outline" className="min-w-20">
            {t('transactions.badge.buy')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'quantity',
      header: () => (
        <div className="flex items-center gap-1">
          <span>{t('transactions.table.headers.quantity')}</span>
          <HybridTooltip>
            <HybridTooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </HybridTooltipTrigger>
            <HybridTooltipContent>
              <p>{t('transactions.tooltips.quantity')}</p>
            </HybridTooltipContent>
          </HybridTooltip>
        </div>
      ),
      cell: ({ row }) => row.original.quantity,
    },
    {
      accessorKey: 'share_price',
      header: () => (
        <div className="flex items-center gap-1 justify-end">
          <span>{t('transactions.table.headers.share_price')}</span>
          <HybridTooltip>
            <HybridTooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </HybridTooltipTrigger>
            <HybridTooltipContent>
              <p>{t('transactions.tooltips.share_price')}</p>
            </HybridTooltipContent>
          </HybridTooltip>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-end">
          {withCurrency(row.original.initial_share_price, i18n.language)}
        </div>
      ),
    },
    {
      accessorKey: 'current_value',
      header: () => (
        <div className="flex items-center gap-1 justify-end">
          <span>{t('transactions.table.headers.current_value')}</span>
          <HybridTooltip>
            <HybridTooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </HybridTooltipTrigger>
            <HybridTooltipContent>
              <p>{t('transactions.tooltips.current_value')}</p>
            </HybridTooltipContent>
          </HybridTooltip>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-end">
          {withCurrency(row.original.final_transaction_value, i18n.language)}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: 'gain',
      header: () => (
        <div className="flex items-center gap-1 justify-end">
          <span>{t('transactions.table.headers.gain')}</span>
          <HybridTooltip>
            <HybridTooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </HybridTooltipTrigger>
            <HybridTooltipContent>
              <p>{t('transactions.tooltips.gain')}</p>
            </HybridTooltipContent>
          </HybridTooltip>
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            'text-end',
            row.original.gain_percentage < 0
              ? 'text-[var(--red)]'
              : row.original.gain_percentage > 0
                ? 'text-[var(--green)]'
                : ''
          )}
        >
          {withCurrency(row.original.gain, i18n.language)}
        </div>
      ),
      enableHiding: true,
    }
  );
}

export function PositionsTable({
  history,
  enablePagination = false,
  className,
}: {
  history: Array<HistoryEntry>;
  enablePagination?: boolean;
  className?: string;
}) {
  const columns = usePositionsColumns();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <DataTable
      className={cn('rounded-lg', className)}
      data={history}
      columns={columns}
      pagination={pagination}
      onPaginationChange={setPagination}
      enablePagination={enablePagination}
      FetchingRowsSkeleton={<PositionsTableSkeleton />}
    />
  );
}

export function PositionsTableSkeleton({
  enablePagination = false,
  className,
}: {
  enablePagination?: boolean;
  className?: string;
}) {
  const columns = usePositionsColumns();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  return (
    <DataTable
      data={[]}
      columns={columns}
      pagination={pagination}
      onPaginationChange={setPagination}
      enablePagination={enablePagination}
      FetchingRowsSkeleton={<PositionsRowsSkeleton />}
      isPending={true}
      className={className}
    />
  );
}

function PositionsRowsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <TableRow key={index} data-testid="pending-state-data-table-row">
          <TableCell>
            <Skeleton className="h-4 w-3/4" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-1/2" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-1/2 ml-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-1/2 ml-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-1/2 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
