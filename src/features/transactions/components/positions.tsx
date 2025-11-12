import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  PositionSummaryWithTable,
  PositionSummaryWithTableSkeleton,
} from './position-summary-with-table';
import { statisticsTransactionsHistoryListOptions } from '@/client/@tanstack/react-query.gen';
import { EmptyMessage } from '@/features/shared/components/empty-message';
import { ErrorMessage } from '@/features/shared/components/error-message';

type PositionsTableProps = {
  type: 'open' | 'closed';
};

export function Positions({ type }: PositionsTableProps) {
  const { t } = useTranslation();
  const { data, isPending, isError } = useQuery(
    statisticsTransactionsHistoryListOptions({ query: { type } })
  );

  if (isError) {
    return <ErrorMessage message={t('transactions.error_loading')} />;
  }

  if (isPending) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <PositionSummaryWithTableSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Safety check: ensure data is an array
  if (!Array.isArray(data)) {
    console.error('Expected array but got:', typeof data, data);
    return <ErrorMessage message={t('transactions.error_invalid_data')} />;
  }

  if (data.length === 0) {
    return (
      <EmptyMessage
        message={t('transactions.no_open_positions')}
        cta={{
          to: '/instruments',
          label: t('instruments.browse_instruments'),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {data.map((position) => (
        <PositionSummaryWithTable key={position.symbol} position={position} />
      ))}
    </div>
  );
}
