import type { QueryClient } from '@tanstack/react-query';
import {
  investorsMeRetrieveOptions,
  ordersListOptions,
  statisticsOwnedSharesListOptions,
  statisticsTransactionsHistoryListOptions,
} from '@/client/@tanstack/react-query.gen';

export function invalidateOrderQueries(
  queryClient: QueryClient,
  ticker: string
) {
  queryClient.invalidateQueries({
    queryKey: statisticsTransactionsHistoryListOptions({
      query: {
        type: 'open',
        tickers: [ticker],
      },
    }).queryKey,
  });
  queryClient.invalidateQueries({
    queryKey: investorsMeRetrieveOptions().queryKey,
  });
  queryClient.invalidateQueries({
    queryKey: statisticsOwnedSharesListOptions().queryKey,
  });
  setTimeout(() => {
    queryClient.invalidateQueries({
      queryKey: ordersListOptions().queryKey,
    });
  }, 1000);
}
