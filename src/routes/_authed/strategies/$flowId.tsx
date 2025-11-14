import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ReactFlowProvider } from '@xyflow/react';
import AppFrame from '@/features/shared/components/app-frame';
import { DnDProvider } from '@/features/flows/utils/dnd-context';
import { FlowsBoard } from '@/features/flows/components/flows-board';
import {
  graphLangRetrieveOptions,
  instrumentsTickersRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';
import { TickerValidationProvider } from '@/features/flows/utils/ticker-validation-context';

export const Route = createFileRoute('/_authed/strategies/$flowId')({
  component: RouteComponent,
  loader: async ({ params: { flowId }, context: { queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        graphLangRetrieveOptions({
          path: {
            id: flowId,
          },
        })
      );
      return { crumb: data.name || `${flowId}` };
    } catch {
      return {
        crumb: `${flowId}`,
      };
    }
  },
});

function RouteComponent() {
  const { flowId } = Route.useParams();

  const { data: tickersData } = useQuery({
    ...instrumentsTickersRetrieveOptions(),
    staleTime: 24 * 60 * 60 * 1000, // 1 day
  });

  const tickerValidationValue = useMemo(() => {
    const validTickers = new Set(
      tickersData?.tickers.map((ticker) => ticker.toUpperCase())
    );
    if (validTickers.size === 0) {
      return {
        validTickers: new Set<string>(),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isValidTicker: (_ticker: string) => true,
      };
    }
    return {
      validTickers,
      isValidTicker: (ticker: string) => {
        console.log('Validating ticker:', ticker);
        return validTickers.has(ticker.toUpperCase());
      },
    };
  }, [tickersData]);

  return (
    <AppFrame className="px-0">
      <TickerValidationProvider value={tickerValidationValue}>
        <ReactFlowProvider>
          <DnDProvider>
            <div className="h-[calc(100vh-var(--header-height)-2rem)]">
              <FlowsBoard id={flowId} />
            </div>
          </DnDProvider>
        </ReactFlowProvider>
      </TickerValidationProvider>
    </AppFrame>
  );
}
