import type { QueryClient } from '@tanstack/react-query';
import type { Options } from '@/client/sdk.gen';
import type { QueryKey } from '@/client/@tanstack/react-query.gen';
import {
  investorsMeAccountValueRetrieveQueryKey,
  investorsMeRetrieveQueryKey,
  ordersListQueryKey,
  statisticsAssetAllocationRetrieveQueryKey,
  statisticsCurrentAccountValueRetrieveQueryKey,
  statisticsOwnedSharesListQueryKey,
  statisticsStatisticsMostTradedListQueryKey,
  statisticsStatisticsTradingOverviewRetrieveQueryKey,
  statisticsTransactionsHistoryListQueryKey,
} from '@/client/@tanstack/react-query.gen';

export function invalidateOrderQueries(
  queryClient: QueryClient,
  tickers: Array<string>
) {
  // balance
  queryClient.invalidateQueries({
    queryKey: investorsMeRetrieveQueryKey(),
  });

  // open positions
  const statisticsTransactionsHistoryListQuerKey =
    statisticsTransactionsHistoryListQueryKey()[0];
  queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey[0] as QueryKey<Options>[0];

      if (statisticsTransactionsHistoryListQuerKey._id !== queryKey._id)
        return false;

      const typedQueryKey =
        queryKey as typeof statisticsTransactionsHistoryListQuerKey;

      return (
        typedQueryKey.query?.tickers === undefined ||
        typedQueryKey.query.tickers.length === 0 ||
        typedQueryKey.query.tickers.some((t) => tickers.includes(t))
      );
    },
  });

  // statistics
  queryClient.invalidateQueries({
    queryKey: statisticsStatisticsMostTradedListQueryKey(),
  });
  queryClient.invalidateQueries({
    queryKey: statisticsStatisticsTradingOverviewRetrieveQueryKey(),
  });

  // owned shares
  queryClient.invalidateQueries({
    queryKey: statisticsOwnedSharesListQueryKey(),
  });

  // current account value
  queryClient.invalidateQueries({
    queryKey: statisticsCurrentAccountValueRetrieveQueryKey(),
  });

  // asset allocation
  queryClient.invalidateQueries({
    predicate: (query) =>
      (query.queryKey[0] as QueryKey<Options>[0])._id ===
      statisticsAssetAllocationRetrieveQueryKey()[0]._id,
  });

  // orders list
  const ordersListKey = ordersListQueryKey()[0];
  queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey[0] as QueryKey<Options>[0];
      if (queryKey._id !== ordersListKey._id) return false;
      const typedQueryKey = queryKey as typeof ordersListKey;
      const ticker = typedQueryKey.query?.ticker;
      return ticker === undefined || tickers.includes(ticker);
    },
  });

  // account
  queryClient.invalidateQueries({
    queryKey: investorsMeAccountValueRetrieveQueryKey(),
  });
}
