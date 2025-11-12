import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { RotateCw } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import type { MarketOrder } from '@/client';
import { DataTable } from '@/features/shared/components/ui/data-table';
import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { ErrorMessage } from '@/features/shared/components/error-message';
import { TableCell, TableRow } from '@/features/shared/components/ui/table';
import { ordersMarketListOptions } from '@/client/@tanstack/react-query.gen';
import { EmptyMessage } from '@/features/shared/components/empty-message';

interface PendingMarketOrdersProps {
  ticker: string;
}

const REFETCH_INTERVAL_MS = 5000;

export function PendingMarketOrders({ ticker }: PendingMarketOrdersProps) {
  const { t } = useTranslation();

  const {
    data: orders,
    isPending,
    isError,
    isSuccess,
    refetch: refetchOrders,
  } = useQuery({
    ...ordersMarketListOptions({ query: { ticker } }),
    refetchInterval: REFETCH_INTERVAL_MS,
  });

  if (isSuccess && orders.length === 0) {
    return <EmptyMessage message={t('orders.no_pending_market_orders')} />;
  }

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase text-muted-foreground">
          {t('orders.pending_market_orders')}
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => refetchOrders()}
          disabled={isPending}
          title={t('orders.refresh_orders')}
          className="h-8 w-8 p-0"
        >
          <RotateCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
        </Button>
      </header>

      {isError ? (
        <ErrorMessage message={t('orders.pending_orders_error')} />
      ) : (
        <PendingMarketOrdersTable data={orders} isPending={isPending} />
      )}
    </section>
  );
}

function PendingMarketOrdersTable({
  data,
  isPending,
}: {
  data: Array<MarketOrder> | undefined;
  isPending: boolean;
}) {
  const { t } = useTranslation();

  const columns: Array<ColumnDef<MarketOrder>> = [
    {
      id: 'side',
      header: t('orders.table.side'),
      cell: ({ row }) => {
        const isBuy = row.original.detail.is_buy;
        return (
          <Badge
            variant={isBuy ? 'secondary' : 'outline'}
            className={
              isBuy
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'text-red-600 border-red-200 dark:text-red-300 dark:border-red-400/40'
            }
          >
            {isBuy ? t('instruments.buy') : t('instruments.sell')}
          </Badge>
        );
      },
    },
    {
      id: 'volume',
      header: t('orders.table.volume'),
      cell: ({ row }) => {
        const volume = row.original.detail.volume;
        return <div className="tabular-nums">{volume}</div>;
      },
    },
    {
      id: 'volume_processed',
      header: t('orders.table.processed'),
      cell: ({ row }) => {
        const processed = row.original.detail.volume_processed;
        return <div className="tabular-nums font-medium">{processed}</div>;
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data || []}
      isPending={isPending}
      FetchingRowsSkeleton={<PendingMarketOrdersRowsSkeleton />}
    />
  );
}

function PendingMarketOrdersRowsSkeleton() {
  return Array.from({ length: 4 }).map((_, idx) => (
    <TableRow key={`skeleton-${idx}`}>
      <TableCell className="h-10">
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell className="h-10">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="h-10">
        <Skeleton className="h-4 w-20" />
      </TableCell>
    </TableRow>
  ));
}
