import { useTranslation } from 'react-i18next';
import { BuySellContainer } from './buy-sell-action';
import type { Position } from '@/features/transactions/types/types';
import type { InstrumentPrice } from '../types/types';
import {
  PositionsTableHeader,
  PositionsTableSkeleton,
} from '@/features/transactions/components/positions-table';
import { PositionRow } from '@/features/transactions/components/position-row';

interface TransactionsHistorySectionProps {
  positionData: Position | undefined;
  currentPriceData: InstrumentPrice | undefined;
  onlySell?: boolean;
  showDetails?: () => void;
}

export function TransactionsHistorySection({
  positionData,
  currentPriceData,
}: TransactionsHistorySectionProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-xl font-semibold mt-6 mb-4">
        {t('transactions.tabs.open_positions')}
      </h2>
      {!positionData || !currentPriceData ? (
        <PositionsTableSkeleton />
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
