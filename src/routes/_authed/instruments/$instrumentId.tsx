import { createFileRoute } from '@tanstack/react-router';

import { useQuery } from '@tanstack/react-query';
import { PositionRow } from '@/features/transactions/components/position-row';
import { instrumentOpenPositionsQueryOptions } from '@/features/instrument-details/queries/fetch-instrument-open-positions';
import {
  PositionsTableHeader,
  PositionsTableSkeleton,
} from '@/features/transactions/components/positions-table';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';

import AppFrame from '@/features/shared/components/app-frame';

export const Route = createFileRoute('/_authed/instruments/$instrumentId')({
  component: InstrumentDetailsPage,
  loader: ({ params: { instrumentId } }) => ({
    crumb: instrumentId,
  }),
});

function InstrumentDetailsPage() {
  const { instrumentId } = Route.useParams();
  const { data } = useQuery({
    ...instrumentOpenPositionsQueryOptions({ ticker: instrumentId }),
  });

  return (
    <AppFrame>
      <h1 className="text-2xl font-bold mb-4">Instrument Details</h1>

      <StockChartContainer ticker={instrumentId} />
      <h2 className="text-xl font-semibold mt-6 mb-4">Open Positions</h2>
      {!data ? (
        <PositionsTableSkeleton />
      ) : (
        <div>
          <PositionsTableHeader />
          <PositionRow position={data} showDetails={() => {}} />
        </div>
      )}
    </AppFrame>
  );
}
