import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchAvailableInstruments } from '../queries/fetch-available-instruments';
import type { Instrument } from '../types/types';
import { fetchInstrumentsOverview } from '@/features/charts/queries/fetch-instrument-overview';

type UseInstrumentsOptions = {
  page: number;
  pageSize: number;
  sector?: string;
  query?: string;
  sortBy?: string;
  sortDirection?: string;
};

export const useInstruments = ({
  page,
  pageSize,
  sector,
  query,
  sortBy,
  sortDirection,
}: UseInstrumentsOptions) => {
  const availableInstruments = useQuery({
    queryKey: ['availableInstruments'],
    queryFn: fetchAvailableInstruments,
  });

  const validTickers = query?.trim()
    ? (availableInstruments.data?.instruments ?? []).filter((ticker) =>
        ticker.toLowerCase().includes(query.toLowerCase().trim())
      )
    : (availableInstruments.data?.instruments ?? []);

  const instruments = useQueries({
    queries: Array.from({ length: page }, (_, i) => i + 1).map((pageNum) => ({
      enabled: validTickers.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
      queryKey: [
        'instruments',
        validTickers,
        pageNum,
        pageSize,
        sector,
        sortBy,
        sortDirection,
      ],
      queryFn: () =>
        fetchInstrumentsOverview({
          tickers: validTickers,
          page: pageNum,
          pageSize,
          sector,
          sortBy,
          sortDirection,
        }),
    })),
    combine: (results) =>
      results.reduce(
        (acc, result) => {
          if (result.isFetching) {
            acc.isFetching = true;
          }

          if (result.isPending) {
            acc.isPending = true;
          }

          if (result.error) {
            acc.error =
              result.error instanceof Error
                ? result.error.message
                : 'Failed to load instruments';
          }

          if (result.data) {
            acc.data.push(...result.data.items);
            acc.numPages = result.data.num_pages;
          }

          return acc;
        },
        {
          data: Array<Instrument>(),
          isPending: false,
          isFetching: false,
          error: null as string | null,
          numPages: 0,
        }
      ),
  });

  return {
    data: instruments.data,
    isPending: availableInstruments.isPending || instruments.isPending,
    isFetching: availableInstruments.isFetching || instruments.isFetching,
    availableInstruments: availableInstruments.data,
    availableInstrumentsLoading: availableInstruments.isLoading,
    isError: availableInstruments.isError || instruments.error != null,
    numPages: instruments.numPages,
    isMore: instruments.numPages > page,
  };
};
