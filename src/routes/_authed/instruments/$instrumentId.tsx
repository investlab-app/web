import { createFileRoute } from '@tanstack/react-router';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';
import { OrdersSection } from '@/features/instrument-details/components/orders-section';
import { TransactionsHistorySection } from '@/features/instrument-details/components/transactions-history-section';
import { InstrumentDetailPending } from '@/features/instrument-details/components/instrument-detail-pending';

import AppFrame from '@/features/shared/components/app-frame';
import { NewsSection } from '@/features/instruments/components/news-section';
import { InstrumentHeader } from '@/features/instruments/components/instrument-with-description-header';
import {
  instrumentsDetailRetrieveOptions,
  newsListOptions,
  pricesListOptions,
  statisticsTransactionsHistoryListOptions,
} from '@/client/@tanstack/react-query.gen';

export const Route = createFileRoute('/_authed/instruments/$instrumentId')({
  component: RouteComponent,
  pendingComponent: InstrumentDetailPending,
  loader: async ({ params: { instrumentId }, context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(
        instrumentsDetailRetrieveOptions({ query: { ticker: instrumentId } })
      ),
      queryClient.ensureQueryData(
        statisticsTransactionsHistoryListOptions({
          query: {
            type: 'open',
            tickers: [instrumentId],
          },
        })
      ),
      queryClient.ensureQueryData(
        newsListOptions({
          query: { ticker: instrumentId },
        })
      ),
      queryClient.ensureQueryData(
        pricesListOptions({
          query: { tickers: [instrumentId] },
        })
      ),
    ]);
    return {
      crumb: instrumentId,
    };
  },
});

function RouteComponent() {
  const { instrumentId: ticker } = Route.useParams();

  return (
    <AppFrame>
      <div className="flex flex-col gap-4">
        <InstrumentHeader ticker={ticker} />
        <StockChartContainer ticker={ticker} />
        <div className="flex gap-4 flex-col 2xl:flex-row">
          <OrdersSection ticker={ticker} className="2xl:flex-1" />
          <TransactionsHistorySection ticker={ticker} className="2xl:flex-2" />
        </div>
        <NewsSection ticker={ticker} />
      </div>
    </AppFrame>
  );
}
