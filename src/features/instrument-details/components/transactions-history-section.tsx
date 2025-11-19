import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  InstrumentSummary,
  InstrumentSummarySkeleton,
} from './instrument-summary';
import { ErrorMessage } from '@/features/shared/components/error-message';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { EmptyMessage } from '@/features/shared/components/empty-message';
import { statisticsTransactionsHistoryListOptions } from '@/client/@tanstack/react-query.gen';
import {
  PositionsTable,
  PositionsTableSkeleton,
} from '@/features/transactions/components/positions-table';

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
        <CardTitle>
          {t('transactions.tabs.instrument_transaction_history')}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full space-y-6">
        {isPending ? (
          <TransactionsHistorySectionSkeleton />
        ) : isError ? (
          <ErrorMessage message={t('transactions.error_loading')} />
        ) : !tickerTransactions.length ? (
          <EmptyMessage message={t('transactions.no_open_positions')} />
        ) : (
          <div className="space-y-6">
            <InstrumentSummary position={tickerTransactions[0]} />
            <PositionsTable
              className="border"
              history={tickerTransactions[0].history}
              enablePagination
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TransactionsHistorySectionSkeleton() {
  return (
    <div className="space-y-6">
      <InstrumentSummarySkeleton />
      <PositionsTableSkeleton />
    </div>
  );
}
