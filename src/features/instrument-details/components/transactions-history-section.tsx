import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { BuySellContainer } from './buy-sell-action';
import {
  PositionsTableBodySkeleton,
  PositionsTableHeader,
} from '@/features/transactions/components/positions-table';
import { PositionRow } from '@/features/transactions/components/position-row';
import { ErrorMessage } from '@/features/shared/components/error-message';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { Table, TableBody } from '@/features/shared/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import {
  investorsMeTransactionsHistoryListOptions,
  pricesRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';
import { EmptyMessage } from '@/features/shared/components/empty-message';

interface TransactionsHistorySectionProps {
  ticker: string;
  className?: string;
}

export function TransactionsHistorySection({
  ticker: instrumentId,
  className,
}: TransactionsHistorySectionProps) {
  const { t } = useTranslation();

  const {
    data: tickerPrice,
    isError: tickerPriceIsError,
    isPending: tickerPriceIsPending,
  } = useQuery(
    pricesRetrieveOptions({
      path: {
        ticker: instrumentId,
      },
    })
  );

  const {
    data: tickerTransactions,
    isError: tickerTransactionsIsError,
    isPending: tickerTransactionsIsPending,
  } = useQuery(
    investorsMeTransactionsHistoryListOptions({
      query: {
        type: 'open',
        ticker: instrumentId,
      },
    })
  );

  const isPending = tickerPriceIsPending || tickerTransactionsIsPending;
  const isError = tickerPriceIsError || tickerTransactionsIsError;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('transactions.tabs.open_positions')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <TransactionsHistorySectionSkeleton />
        ) : isError ? (
          <ErrorMessage message={t('transactions.error_loading')} />
        ) : !tickerTransactions.length ? (
          <EmptyMessage message={t('transactions.no_open_positions')} />
        ) : (
          <>
            <BuySellContainer
              currentPrice={parseFloat(tickerPrice.current_price)}
              onlySell={true}
            />
            <Table>
              <PositionsTableHeader />
              <TableBody>
                {tickerTransactions.map((position) => (
                  <PositionRow
                    key={position.name}
                    position={position}
                    isNavigable={false}
                  />
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function TransactionsHistorySectionSkeleton() {
  return (
    <div>
      <Skeleton className="h-20 mb-4" />
      <Table>
        <PositionsTableHeader />
        <TableBody>
          <PositionsTableBodySkeleton length={1} />
        </TableBody>
      </Table>
    </div>
  );
}
