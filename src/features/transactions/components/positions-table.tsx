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

function usePositionsColumns(
  currentPrice?: number,
  history: Array<HistoryEntry> = []
) {
  const { t, i18n } = useTranslation();

  const calculateAverageBuyPrice = (upToIndex: number): number | null => {
    let totalCost = 0;
    let totalQuantity = 0;

    for (let i = 0; i < upToIndex; i++) {
      const entry = history[i];
      if (entry.is_buy) {
        totalCost += entry.share_price * entry.quantity;
        totalQuantity += entry.quantity;
      } else {
        totalQuantity -= entry.quantity;
      }
    }

    if (totalQuantity <= 0) return null;
    return totalCost / totalQuantity;
  };

  const calculateNumericalGain = (
    entry: HistoryEntry,
    entryIndex: number,
    price?: number
  ): number | null => {
    if (entry.is_buy) {
      // For BUY transactions: (current price - purchase price) × quantity
      if (!price) return null;
      return (price - entry.share_price) * entry.quantity;
    } else {
      // For SELL transactions: (sell price - average purchase price) × quantity
      const avgBuyPrice = calculateAverageBuyPrice(entryIndex);
      if (avgBuyPrice === null) return null;
      return (entry.share_price - avgBuyPrice) * entry.quantity;
    }
  };

  const calculatePercentageGain = (
    entry: HistoryEntry,
    numericalGain: number | null | undefined,
    entryIndex?: number
  ): number | null => {
    if (numericalGain === undefined || numericalGain === null) return null;

    let totalAcquisitionCost = 0;
    if (entry.is_buy) {
      totalAcquisitionCost = entry.share_price * entry.quantity;
    } else {
      if (entryIndex === undefined) return null;
      const avgBuyPrice = calculateAverageBuyPrice(entryIndex);
      if (avgBuyPrice === null) return null;
      totalAcquisitionCost = avgBuyPrice * entry.quantity;
    }

    if (totalAcquisitionCost === 0) return null;
    return (numericalGain / totalAcquisitionCost) * 100;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getGainColor = (value: number): string => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  return new Array<ColumnDef<HistoryEntry>>(
    {
      accessorKey: 'timestamp',
      header: () => (
        <div className="flex items-center gap-1">
          <span>{t('transactions.table.headers.transaction')}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('transactions.tooltips.transaction')}</p>
            </TooltipContent>
          </Tooltip>
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
            {row.original.is_buy
              ? t('transactions.badge.buy')
              : t('transactions.badge.sell')}
          </Badge>
        </div>
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
        <div className="text-end">
          {formatCurrency(row.original.share_price)}
        </div>
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
          {row.original.acquisition_price
            ? formatCurrency(row.original.acquisition_price)
            : 'N/A'}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: 'gain',
      header: () => (
        <div className="flex items-center gap-1 justify-end">
          <span>{t('transactions.table.headers.gain_loss')}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('transactions.tooltips.gain_loss')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => {
        const entryIndex = history.findIndex(
          (h) => h.timestamp === row.original.timestamp
        );
        const gain = calculateNumericalGain(
          row.original,
          entryIndex,
          currentPrice
        );
        if (gain === null)
          return <div className="text-end text-muted-foreground">—</div>;
        return (
          <div className={`text-end font-medium ${getGainColor(gain)}`}>
            {formatCurrency(gain)}
          </div>
        );
      },
    },
    {
      accessorKey: 'gain_percentage',
      header: () => (
        <div className="flex items-center gap-1 justify-end">
          <span>{t('transactions.table.headers.gain_loss_pct')}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="p-1 size-5 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('transactions.tooltips.gain_loss_pct')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => {
        const entryIndex = history.findIndex(
          (h) => h.timestamp === row.original.timestamp
        );
        const gain = calculateNumericalGain(
          row.original,
          entryIndex,
          currentPrice
        );
        const gainPct = calculatePercentageGain(row.original, gain, entryIndex);
        if (gainPct === null)
          return <div className="text-end text-muted-foreground">—</div>;
        return (
          <div className={`text-end font-medium ${getGainColor(gainPct)}`}>
            {formatPercentage(gainPct)}
          </div>
        );
      },
    }
  );
}

export function PositionsTable({
  history,
  currentPrice,
  enablePagination = false,
  className,
}: {
  history: Array<HistoryEntry>;
  currentPrice?: number;
  enablePagination?: boolean;
  className?: string;
}) {
  const columns = usePositionsColumns(currentPrice, history);
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
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="animate-pulse grid grid-cols-6 gap-4 py-2">
          <div className="h-4 bg-muted rounded col-span-2 w-3/4" />
          <div className="h-4 bg-muted rounded col-span-1 w-1/2 ml-auto" />
          <div className="h-4 bg-muted rounded col-span-1 w-1/2 ml-auto" />
          <div className="h-4 bg-muted rounded col-span-1 w-1/2 ml-auto" />
          <div className="h-4 bg-muted rounded col-span-1 w-1/2 ml-auto" />
        </div>
      ))}
    </>
  );
}
