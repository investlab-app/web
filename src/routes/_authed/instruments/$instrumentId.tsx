import { createFileRoute } from '@tanstack/react-router';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';
import { OrdersSection } from '@/features/instrument-details/components/orders-section';
import { TransactionsHistorySection } from '@/features/instrument-details/components/transactions-history-section';

import AppFrame from '@/features/shared/components/app-frame';
import { NewsSection } from '@/features/instruments/components/news-section';
import { InstrumentHeader } from '@/features/instruments/components/instrument-with-description-header';

export const Route = createFileRoute('/_authed/instruments/$instrumentId')({
  component: InstrumentDetailsPage,
  loader: ({ params: { instrumentId } }) => {
    return {
      crumb: instrumentId,
    };
  },
});

function InstrumentDetailsPage() {
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
