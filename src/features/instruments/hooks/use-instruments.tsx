import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { fetchAvailableInstruments } from '../queries/fetch-available-instruments';
import type { InstrumentOverviewInstrument } from '@/features/charts/types/types';
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
  const { getToken } = useAuth();

  const {
    data: availableInstruments = [],
    isLoading: availableInstrumentsLoading,
    error: availableInstrumentsError,
  } = useQuery({
    queryKey: ['availableInstruments'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No auth token available');
      return fetchAvailableInstruments({ token });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const filteredTickers = useMemo(() => {
    if (!filter.trim()) return availableInstruments;
    return availableInstruments.filter((ticker) =>
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
        const token = await getToken();
        if (!token) throw new Error('No auth token available');
        return await fetchInstrumentsOverview({
          tickers: filteredTickers.length > 0 ? filteredTickers : undefined,
          page: pageNum,
          pageSize: perPage,
          sector,
          sortBy,
          sortDirection,
          token,
        });
      },
      refetchOnWindowFocus: false,
      enabled: filteredTickers.length > 0 || !filteredTickers,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  const combinedData = useMemo(() => {
    let allInstruments: Array<InstrumentOverviewInstrument> = [];
    let totalItems = 0;
    let numPages = 0;
    let errorMessage: string | null = null;
    let isLoading = false;

    for (const query of instrumentPages) {
      if (query.isLoading) isLoading = true;
      if (query.error) {
        errorMessage =
          query.error instanceof Error
            ? query.error.message
            : 'Failed to load instruments';
        break;
      }
      if (query.data) {
        allInstruments = [...allInstruments, ...query.data.instruments];
        totalItems = query.data.total;
        numPages = query.data.numPages;
      }
    }

    return {
      instruments: allInstruments,
      loading: isLoading,
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
    loading: availableInstrumentsLoading || combinedData.loading,
    hasMore: combinedData.hasMore,
    availableInstruments,
    availableInstrumentsLoading,
    error,
    totalItems: combinedData.totalItems,
    numPages: combinedData.numPages,
  };
};
