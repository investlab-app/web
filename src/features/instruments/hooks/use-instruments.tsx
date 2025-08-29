import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchAvailableInstruments } from '../queries/fetch-available-instruments';
import type { Instrument } from '../types/types';
import { fetchInstrumentsOverview } from '@/features/charts/queries/fetch-instrument-overview';

type UseInstrumentsOptions = {
  filter?: string;
  page: number;
  perPage: number;
  sector?: string;
  sortBy?: string;
  sortDirection?: string;
};

export const useInstruments = ({
  filter = '',
  page,
  perPage,
  sector,
  sortBy,
  sortDirection,
}: UseInstrumentsOptions) => {
  const {
    data: availableInstruments = { instruments: [] },
    isPending: availableInstrumentsPending,
    error: availableInstrumentsError,
  } = useQuery({
    queryKey: ['availableInstruments'],
    queryFn: fetchAvailableInstruments,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const filteredTickers =
    filter.trim().length > 0
      ? availableInstruments.instruments.filter((ticker) =>
          ticker.toLowerCase().includes(filter.toLowerCase().trim())
        )
      : availableInstruments.instruments;

  const pagesToFetch = Array.from({ length: page }, (_, i) => i + 1);

  const instrumentPages = useQueries({
    queries: pagesToFetch.map((pageNum) => {
      const args = {
        tickers: filteredTickers.length > 0 ? filteredTickers : undefined,
        page: pageNum,
        pageSize: perPage,
        sector,
        sortBy,
        sortDirection,
      };
      return {
        queryKey: ['instruments', args],
        queryFn: () => fetchInstrumentsOverview(args),
        refetchOnWindowFocus: false,
        enabled: filteredTickers.length > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
      };
    }),
  });

  const stableQueryStates = instrumentPages.map((query) => ({
    data: query.data,
    isPending: query.isPending,
    error: query.error,
  }));

  const combinedData = stableQueryStates.reduce(
    (acc, query) => {
      if (query.isPending) {
        acc.isPending = true;
        return acc;
      }

      if (query.error) {
        acc.error =
          query.error instanceof Error
            ? query.error.message
            : 'Failed to load instruments';
        return acc;
      }

      if (query.data) {
        acc.instruments.push(...query.data.items);
        acc.totalItems = query.data.total;
        acc.numPages = query.data.num_pages;
      }

      return acc;
    },
    {
      instruments: [] as Array<Instrument>,
      totalItems: 0,
      numPages: 0,
      error: null as string | null,
      isPending: false,
    }
  );

  const hasMore = page < combinedData.numPages;

  const error = availableInstrumentsError
    ? availableInstrumentsError instanceof Error
      ? availableInstrumentsError.message
      : 'Failed to load available instruments'
    : combinedData.error;

  return {
    instruments: combinedData.instruments,
    loading: availableInstrumentsPending || combinedData.isPending,
    hasMore,
    availableInstruments,
    availableInstrumentsLoading: availableInstrumentsPending,
    error,
    totalItems: combinedData.totalItems,
    numPages: combinedData.numPages,
  };
};
