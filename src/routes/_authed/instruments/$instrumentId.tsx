import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';
import { OrdersSection } from '@/features/instrument-details/components/orders-section';
import { TransactionsHistorySection } from '@/features/instrument-details/components/transactions-history-section';
import { instrumentOpenPositionsQueryOptions } from '@/features/instrument-details/queries/fetch-instrument-open-positions';
import { instrumentCurrentPriceQueryOptions } from '@/features/instrument-details/queries/fetch-instrument-price';

import AppFrame from '@/features/shared/components/app-frame';
import NewsSection from '@/features/instruments/components/news-section';
import { instrumentInfoQueryOptions } from '@/features/instrument-details/queries/fetch-instrument-info';
import { InstrumentInfoSection } from '@/features/instrument-details/components/instrument-info-section';

export const Route = createFileRoute('/_authed/instruments/$instrumentId')({
  component: InstrumentDetailsPage,
  loader: ({ params: { instrumentId } }) => ({
    crumb: instrumentId,
  }),
});

function InstrumentDetailsPage() {
  const { instrumentId } = Route.useParams();
  const { data: openPositionsData, isError: isOpenPositionsError } = useQuery(
    instrumentOpenPositionsQueryOptions({ ticker: instrumentId })
  );
  const { data: currentPriceData, isError: isCurrentPriceError } = useQuery(
    instrumentCurrentPriceQueryOptions({ ticker: instrumentId })
  );
  const { data: instrumentInfoData, isError: isInstrumentInfoError } = useQuery(
    instrumentInfoQueryOptions({ ticker: instrumentId })
  );
  const { t } = useTranslation();

  return (
    <AppFrame>
      <h1 className="text-2xl font-bold mb-4">
        {instrumentId} - {t('instruments.instrument_details')}
      </h1>
      <StockChartContainer ticker={instrumentId} />
      <div className="2xl:flex 2xl:flex-row 2xl:gap-4">
        <div className="2xl:w-1/3">
          <OrdersSection
            currentPriceData={currentPriceData}
            isError={isCurrentPriceError}
          />
        </div>
        <div className="2xl:w-2/3">
          <TransactionsHistorySection
            positionData={openPositionsData}
            currentPriceData={currentPriceData}
            isError={isOpenPositionsError || isCurrentPriceError}
          />
        </div>
      </div>
      <InstrumentInfoSection
        instrumentData={instrumentInfoData}
        isError={isInstrumentInfoError}
      />
      <NewsSection ticker={instrumentId} />
    </AppFrame>
  );
}
