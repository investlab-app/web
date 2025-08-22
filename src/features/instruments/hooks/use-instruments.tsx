import { useMemo } from 'react';
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

  const filteredTickers = useMemo(() => {
    if (!filter.trim()) return availableInstruments.instruments;
    return availableInstruments.instruments.filter((ticker) =>
      ticker.toLowerCase().includes(filter.toLowerCase().trim())
    );
  }, [availableInstruments, filter]);

  const pagesToFetch = Array.from({ length: page }, (_, i) => i + 1);

  const instrumentPages = useQueries({
    queries: pagesToFetch.map((pageNum) => ({
      queryKey: [
        'instruments',
        {
          tickers: filteredTickers,
          page: pageNum,
          perPage,
          sector,
          sortBy,
          sortDirection,
        },
      ],
      queryFn: async () => {
        return await fetchInstrumentsOverview({
          tickers: filteredTickers.length > 0 ? filteredTickers : undefined,
          page: pageNum,
          pageSize: perPage,
          sector,
          sortBy,
          sortDirection,
        });
      },
      refetchOnWindowFocus: false,
      enabled: filteredTickers.length > 0 || !filteredTickers,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  const combinedData = useMemo(() => {
    let allInstruments: Array<Instrument> = [];
    let totalItems = 0;
    let numPages = 0;
    let errorMessage: string | null = null;
    let isPending = false;

    for (const query of instrumentPages) {
      if (query.isPending) isPending = true;
      if (query.error) {
        errorMessage =
          query.error instanceof Error
            ? query.error.message
            : 'Failed to load instruments';
        break;
      }
      if (query.data) {
        allInstruments = [...allInstruments, ...query.data.items];
        totalItems = query.data.total;
        numPages = query.data.num_pages;
      }
    }

    return {
      instruments: allInstruments,
      pending: isPending,
      error: errorMessage,
      totalItems,
      numPages,
      hasMore: page < numPages,
    };
    // eslint-disable-next-line @tanstack/query/no-unstable-deps
  }, [instrumentPages, page]);

  const error = availableInstrumentsError
    ? availableInstrumentsError instanceof Error
      ? availableInstrumentsError.message
      : 'Failed to load available instruments'
    : combinedData.error;

  return {
    instruments: combinedData.instruments,
    loading: availableInstrumentsPending || combinedData.pending,
    hasMore: combinedData.hasMore,
    availableInstruments,
    availableInstrumentsLoading: availableInstrumentsPending,
    error,
    totalItems: combinedData.totalItems,
    numPages: combinedData.numPages,
  };
};
