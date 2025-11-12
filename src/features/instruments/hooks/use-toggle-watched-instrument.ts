import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type {
  InstrumentWithPrice,
  PaginatedInstrumentWithPriceList,
} from '@/client/types.gen';
import {
  instrumentsWithPricesListInfiniteQueryKey,
  investorsMeWatchedTickersListQueryKey,
} from '@/client/@tanstack/react-query.gen';
import { investorsMeWatchedTickersPartialUpdate } from '@/client';

export function useSetWatchedTicker() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      instrument_id,
      is_watched,
    }: {
      instrument_id: string;
      is_watched: boolean;
    }) =>
      investorsMeWatchedTickersPartialUpdate({
        body: { is_watched },
        path: { instrument_id },
      }),
    onMutate: async ({
      instrument_id,
    }: {
      instrument_id: string;
      is_watched: boolean;
    }) => {
      const instrumentId = instrument_id;
      // Optimistically update instrumentsWithPricesListInfinite queries
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: instrumentsWithPricesListInfiniteQueryKey(),
        exact: false,
      });

      // Get all queries
      const queryCache = queryClient.getQueryCache();
      const baseKey = instrumentsWithPricesListInfiniteQueryKey();
      const matchingQueries = queryCache.findAll({ queryKey: baseKey });

      // Backup
      const previousDataMap = new Map();
      matchingQueries.forEach((query) => {
        previousDataMap.set(JSON.stringify(query.queryKey), query.state.data);
      });

      // Optimistically update
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- the onMutate can fail
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
      toast.error(t('instruments.watch.toggle_error'));
    },
    onSuccess: () => {
      // Invalidate watched tickers list to refetch
      queryClient.invalidateQueries({
        queryKey: investorsMeWatchedTickersListQueryKey(),
      });
    },
  });
}
