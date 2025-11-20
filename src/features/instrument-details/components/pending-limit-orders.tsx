import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RotateCw, X } from 'lucide-react';
import { toast } from 'sonner';
import type { ColumnDef } from '@tanstack/react-table';

import type { LimitOrder } from '@/client';
import { DataTable } from '@/features/shared/components/ui/data-table';
import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { ErrorMessage } from '@/features/shared/components/error-message';
import {
  investorsMeRetrieveQueryKey,
  ordersCancelDestroyMutation,
  ordersLimitListOptions,
  ordersLimitListQueryKey,
} from '@/client/@tanstack/react-query.gen';
import { withCurrency } from '@/features/shared/utils/numbers';
import { TableCell, TableRow } from '@/features/shared/components/ui/table';
import { EmptyMessage } from '@/features/shared/components/empty-message';

interface PendingLimitOrdersProps {
  ticker: string;
}

export function PendingLimitOrders({ ticker }: PendingLimitOrdersProps) {
  const { t } = useTranslation();

  const { data, isPending, isError, isSuccess, refetch } = useQuery(
    ordersLimitListOptions({ query: { ticker } })
  );

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase text-muted-foreground">
          {t('orders.pending_limit_orders')}
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => refetch()}
          disabled={isPending}
          title={t('orders.refresh_orders')}
          className="h-8 w-8 p-0"
        >
          <RotateCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
        </Button>
      </header>

      {isError ? (
        <ErrorMessage message={t('orders.pending_orders_error')} />
      ) : isSuccess && data.length === 0 ? (
        <EmptyMessage message={t('orders.no_pending_limit_orders')} />
      ) : (
        <PendingLimitOrdersTable
          data={data}
          isPending={isPending}
          ticker={ticker}
        />
      )}
    </section>
  );
}

function PendingLimitOrdersTable({
  data,
  isPending,
  ticker,
}: {
  data: Array<LimitOrder> | undefined;
  isPending: boolean;
  ticker: string;
}) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    ...ordersCancelDestroyMutation(),
    onSuccess: () => {
      toast.success(t('orders.cancel_order_success'));
      queryClient.invalidateQueries({
        queryKey: ordersLimitListQueryKey({ query: { ticker } }),
      });
      queryClient.invalidateQueries({
        queryKey: investorsMeRetrieveQueryKey(),
      });
    },
    onError: () => {
      toast.error(t('orders.cancel_order_failed'));
    },
  });

  const columns: Array<ColumnDef<LimitOrder>> = [
    {
      id: 'side',
      header: t('orders.table.side'),
      cell: ({ row }) => {
        const isBuy = row.original.detail.is_buy;
        return (
          <Badge variant={isBuy ? 'green' : 'red'}>
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
        return (
          <div className="tabular-nums text-muted-foreground">{processed}</div>
        );
      },
    },
    {
      id: 'limit_price',
      header: t('orders.table.limit_price'),
      cell: ({ row }) => {
        const price = row.original.detail.limit_price;
        return (
          <div className="tabular-nums">
            {withCurrency(Number(price), i18n.language, 4)}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: t('orders.table.actions'),
      cell: ({ row }) => {
        return (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => cancelOrder({ path: { id: row.original.id } })}
            disabled={isCancelling}
            title={t('orders.cancel_order')}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <X className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable
      className="border"
      columns={columns}
      data={data || []}
      isPending={isPending}
      FetchingRowsSkeleton={<PendingLimitOrdersRowsSkeleton />}
    />
  );
}

function PendingLimitOrdersRowsSkeleton() {
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
      <TableCell className="h-10">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="h-10">
        <Skeleton className="h-4 w-8" />
      </TableCell>
    </TableRow>
  ));
}
