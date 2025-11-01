import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { useState } from 'react';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import type { HistoryEntry } from '@/client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/components/ui/tooltip';
import { dateToLocale } from '@/features/shared/utils/date';
import { Badge } from '@/features/shared/components/ui/badge';
import { DataTable } from '@/features/shared/components/ui/data-table';

function usePositionsColumns() {
  const { t, i18n } = useTranslation();
  return new Array<ColumnDef<HistoryEntry>>(
    {
      accessorKey: 'name',
      header: () => (
        <div className="flex items-center gap-1">
          <span>{t('transactions.table.headers.name')}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('transactions.tooltips.name')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => (
        <>
          <Badge
            aria-label={dateToLocale(row.original.timestamp, i18n.language)}
            title={row.original.timestamp}
            variant="secondary"
            className="min-w-24"
          >
            {dateToLocale(row.original.timestamp, i18n.language)}
          </Badge>
          <Badge variant="outline" className="min-w-20">
            {row.original.is_buy
              ? t('transactions.badge.buy')
              : t('transactions.badge.sell')}
          </Badge>
        </>
      ),
    },
    {
      accessorKey: 'quantity',
      header: () => (
        <div className="flex items-center gap-1">
          <span>{t('transactions.table.headers.quantity')}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('transactions.tooltips.quantity')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => row.original.quantity,
    },
    {
      accessorKey: 'share_price',
      header: () => (
        <div className="flex items-center gap-1 justify-end">
          <span>{t('transactions.table.headers.share_price')}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('transactions.tooltips.share_price')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-end">{row.original.share_price}</div>
      ),
    },
    {
      accessorKey: 'acquisition_price',
      header: () => (
        <div className="flex items-center gap-1 justify-end">
          <span>{t('transactions.table.headers.acquisition_price')}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('transactions.tooltips.acquisition_price')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-end">
          {row.original.acquisition_price || 'N/A'}
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
      className={className}
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
}: {
  enablePagination?: boolean;
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
    />
  );
}

function PositionsRowsSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="animate-pulse grid grid-cols-4 gap-4 py-2">
          <div className="h-4 bg-muted rounded col-span-2 w-3/4" />
          <div className="h-4 bg-muted rounded col-span-1 w-1/2 ml-auto" />
          <div className="h-4 bg-muted rounded col-span-1 w-1/2 ml-auto" />
        </div>
      ))}
    </>
  );
}
