import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { convertToInstruments, type Instrument } from './instrument';
import {
  fetchAvailableInstruments,
  fetchInstrumentsOverview,
} from '@/remote/api';
import { useAuth } from '@clerk/clerk-react';

type UseInstrumentsOptions = {
  filter?: string;
  page: number;
  perPage: number;
  sector?: string;
  sortBy?: string;
  sortDirection?: string;
};

type UseInstrumentsReturn = {
  instruments: Instrument[];
  loading: boolean;
  hasMore: boolean;
  availableInstruments: string[];
  availableInstrumentsLoading: boolean;
  error: string | null;
  totalItems: number;
  numPages: number;
};

const useInstruments = ({
  filter = '',
  page,
  perPage,
  sector,
  sortBy,
  sortDirection,
}: UseInstrumentsOptions): UseInstrumentsReturn => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const {
    data: availableInstruments = [],
    isLoading: availableInstrumentsLoading,
    error: availableInstrumentsError,
  } = useQuery({
    queryKey: ['availableInstruments'],
    queryFn: async () => {
      const token = await getToken();

      if (!token) {
        throw new Error('No auth token available');
      }

      return fetchAvailableInstruments({ token });
    },
  });

  const filteredTickers = useMemo(() => {
    if (!filter || filter.trim().length === 0) {
      return availableInstruments;
    }
    return availableInstruments.filter((ticker: string) =>
      ticker.toLowerCase().includes(filter.toLowerCase())
    );
  }, [availableInstruments, filter]);

  const pagesToFetch = useMemo(() => {
    return Array.from({ length: currentPage }, (_, i) => i + 1);
  }, [currentPage]);

  const instrumentQueries = useQueries({
    queries: pagesToFetch.map((pageNum) => ({
      queryKey: [
        'instruments',
        {
          filter: filter.trim(),
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

        const response = await fetchInstrumentsOverview({
          tickers: filteredTickers.length > 0 ? filteredTickers : undefined,
          page: pageNum,
          pageSize: perPage,
          sector,
          sortBy,
          sortDirection,
          token,
        });

        const items = response.items || [];
        const total = response.total || 0;
        const pages = response.num_pages || 0;

        return {
          instruments: convertToInstruments(items),
          total,
          numPages: pages,
          page: pageNum,
        };
      },
      enabled:
        filteredTickers.length > 0 || !filter || filter.trim().length === 0,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  const combinedData = useMemo(() => {
    const allInstruments: Instrument[] = [];
    let totalItems = 0;
    let numPages = 0;
    let hasError = false;
    let errorMessage: string | null = null;
    let isLoading = false;

    for (const query of instrumentQueries) {
      if (query.isLoading) {
        isLoading = true;
      }

      if (query.error) {
        hasError = true;
        errorMessage =
          query.error instanceof Error
            ? query.error.message
            : 'Failed to load instruments';
        break;
      }

      if (query.data) {
        allInstruments.push(...query.data.instruments);
        totalItems = query.data.total;
        numPages = query.data.numPages;
      }
    }

    return {
      data: allInstruments,
      loading: isLoading,
      error: hasError ? errorMessage : null,
      totalItems,
      numPages,
      hasMore: currentPage < numPages,
    };
  }, [instrumentQueries, currentPage]);

  const finalError = availableInstrumentsError
    ? availableInstrumentsError instanceof Error
      ? availableInstrumentsError.message
      : 'Failed to load available instruments'
    : combinedData.error;

  return {
    instruments: combinedData.data,
    loading: availableInstrumentsLoading || combinedData.loading,
    hasMore: combinedData.hasMore,
    availableInstruments,
    availableInstrumentsLoading,
    error: finalError,
    totalItems: combinedData.totalItems,
    numPages: combinedData.numPages,
  };
};

export default useInstruments;
