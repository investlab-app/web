import type { QueryClient } from '@tanstack/react-query';
import type { Options } from '@/client/sdk.gen';
import type { QueryKey } from '@/client/@tanstack/react-query.gen';
import {
  investorsMeAccountValueRetrieveQueryKey,
  investorsMeRetrieveQueryKey,
  ordersLimitListQueryKey,
  ordersMarketListQueryKey,
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

  // pending orders list
  const ordersMarketListKey = ordersMarketListQueryKey()[0];
  const ordersLimitListKey = ordersLimitListQueryKey()[0];
  queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey[0] as QueryKey<Options>[0];
      switch (queryKey._id) {
        case ordersMarketListKey._id: {
          const typedQueryKey = queryKey as typeof ordersMarketListKey;
          const ticker = typedQueryKey.query?.ticker;
          return ticker === undefined || tickers.includes(ticker);
        }
        case ordersLimitListKey._id: {
          const typedQueryKey = queryKey as typeof ordersLimitListKey;
          const ticker = typedQueryKey.query?.ticker;
          return ticker === undefined || tickers.includes(ticker);
        }
        default:
          return false;
      }
    },
  });

  // account
  queryClient.invalidateQueries({
    queryKey: investorsMeAccountValueRetrieveQueryKey(),
  });
}
