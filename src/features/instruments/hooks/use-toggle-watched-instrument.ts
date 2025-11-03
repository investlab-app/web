import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  InstrumentWithPrice,
  PaginatedInstrumentWithPriceList,
} from '@/client/types.gen';
import { investorsMeWatchedInstrumentsToggleCreate } from '@/client/sdk.gen';
import {
  instrumentsWithPricesListInfiniteQueryKey,
  investorsMeWatchedTickersListQueryKey,
} from '@/client/@tanstack/react-query.gen';

export function useToggleWatchedInstrument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (instrumentId: string) => {
      return investorsMeWatchedInstrumentsToggleCreate({
        path: {
          instrument_id: instrumentId,
        },
      });
    },
    onMutate: async (instrumentId: string) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({
        queryKey: instrumentsWithPricesListInfiniteQueryKey(),
        exact: false,
      });

      // Get all queries matching the base key (regardless of parameters)
      const queryCache = queryClient.getQueryCache();
      const baseKey = instrumentsWithPricesListInfiniteQueryKey();
      const matchingQueries = queryCache.findAll({
        queryKey: baseKey,
      });

      // Store previous data from all matching queries for rollback
      const previousDataMap = new Map();
      matchingQueries.forEach((query) => {
        previousDataMap.set(JSON.stringify(query.queryKey), query.state.data);
      });

      // Optimistically update all matching queries
      matchingQueries.forEach((query) => {
        queryClient.setQueryData(
          query.queryKey,
          (
            old: { pages: Array<PaginatedInstrumentWithPriceList> } | undefined
          ) => {
            if (!old?.pages) return old;
            return {
              ...old,
              pages: old.pages.map(
                (page: PaginatedInstrumentWithPriceList) => ({
                  ...page,
                  results: page.results.map(
                    (instrument: InstrumentWithPrice) =>
                      instrument.id === instrumentId
                        ? { ...instrument, is_watched: !instrument.is_watched }
                        : instrument
                  ),
                })
              ),
            };
          }
        );
      });

      // Return previous data for rollback on error
      return { previousDataMap, baseKey };
    },
    onError: (_error, _variables, context) => {
      // Rollback to previous data on error for all affected queries
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (context?.previousDataMap && context?.baseKey) {
        const queryCache = queryClient.getQueryCache();
        const matchingQueries = queryCache.findAll({
          queryKey: context.baseKey,
        });

        matchingQueries.forEach((query) => {
          const previousData = context.previousDataMap.get(
            JSON.stringify(query.queryKey)
          );
          if (previousData !== undefined) {
            queryClient.setQueryData(query.queryKey, previousData);
          }
        });
      }
      toast.error('Failed to update watchlist');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: investorsMeWatchedTickersListQueryKey(),
      });
    },
  });
}
