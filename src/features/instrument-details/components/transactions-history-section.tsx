import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  PositionsTable,
  PositionsTableSkeleton,
} from '@/features/transactions/components/positions-table';
import { ErrorMessage } from '@/features/shared/components/error-message';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { statisticsTransactionsHistoryListOptions } from '@/client/@tanstack/react-query.gen';
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
    data: tickerTransactions,
    isError: tickerTransactionsIsError,
    isPending: tickerTransactionsIsPending,
  } = useQuery(
    statisticsTransactionsHistoryListOptions({
      query: {
        type: 'open',
        tickers: [instrumentId],
      },
    })
  );

  const isPending = tickerTransactionsIsPending;
  const isError = tickerTransactionsIsError;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('transactions.tabs.open_positions')}</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        {isPending ? (
          <TransactionsHistorySectionSkeleton />
        ) : isError ? (
          <ErrorMessage message={t('transactions.error_loading')} />
        ) : !tickerTransactions.length ? (
          <EmptyMessage message={t('transactions.no_open_positions')} />
        ) : (
          <PositionsTable history={tickerTransactions[0].history} />
        )}
      </CardContent>
    </Card>
  );
}

function TransactionsHistorySectionSkeleton() {
  return (
    <div>
      <Skeleton className="h-20 mb-4" />
      <PositionsTableSkeleton />
    </div>
  );
}
