import { useTranslation } from 'react-i18next';
import { BuySellContainer } from './buy-sell-action';
import type { Position } from '@/features/transactions/types/types';
import type { InstrumentPrice } from '../types/types';
import {
  PositionsTableHeader,
  PositionsTableSkeleton,
} from '@/features/transactions/components/positions-table';
import { PositionRow } from '@/features/transactions/components/position-row';
import { Message } from '@/features/shared/components/error-message';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

interface TransactionsHistorySectionProps {
  positionData: Position | undefined;
  currentPriceData: InstrumentPrice | undefined;
  isError: boolean;
}

export function TransactionsHistorySection({
  positionData,
  currentPriceData,
  isError,
}: TransactionsHistorySectionProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-xl font-semibold mt-6 mb-4">
        {t('transactions.tabs.open_positions')}
      </h2>
      {isError ? (
        <Message message={t('transactions.error_loading')} />
      ) : !positionData || !currentPriceData ? (
        <TransactionsHistorySectionSkeleton />
      ) : (
        <div>
          <BuySellContainer
            currentPrice={currentPriceData.currentPrice}
            onlySell={true}
          />
          <PositionsTableHeader />
          <PositionRow position={positionData} showDetails={() => {}} />
        </div>
      )}
    </div>
  );
}

function TransactionsHistorySectionSkeleton() {
  return (
    <div>
      <Skeleton className="h-20 mb-4" />
      <PositionsTableSkeleton length={1} />
    </div>
  );
}
