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
  // balance
  queryClient.invalidateQueries({
    queryKey: investorsMeRetrieveOptions().queryKey,
  });

  // open positions
  queryClient.invalidateQueries({
    queryKey: statisticsTransactionsHistoryListOptions({
      query: {
        type: 'open',
        tickers: [ticker],
      },
    }).queryKey,
  });

  // owned shares
  queryClient.invalidateQueries({
    queryKey: statisticsOwnedSharesListOptions().queryKey,
  });

  // orders list
  setTimeout(() => {
    queryClient.invalidateQueries({
      queryKey: ordersListOptions().queryKey,
    });
  }, 1000);
}
