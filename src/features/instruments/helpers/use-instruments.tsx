// Updated hook
import { useState, useEffect, useCallback } from 'react';
import {
  convertToInstrument,
  convertToInstruments,
  type Instrument,
} from './instrument';
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
  data: Instrument[];
  loading: boolean;
  hasMore: boolean;
  availableInstruments: string[];
  availableInstrumentsLoading: boolean;
  error: string | null;
  // refetch: () => void;
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
  const [data, setData] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [availableInstruments, setAvailableInstruments] = useState<string[]>(
    []
  );
  const [availableInstrumentsLoading, setAvailableInstrumentsLoading] =
    useState(false);
  const [availableInstrumentsFetched, setAvailableInstrumentsFetched] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchAvailable = async () => {
      if (!availableInstrumentsLoading && !availableInstrumentsFetched) {
        try {
          setAvailableInstrumentsLoading(true);
          const token = await getToken();
          if (!token) throw new Error('No auth token available');

          const response = await fetchAvailableInstruments({ token });
          setAvailableInstruments(response.instruments || response || []);
          setAvailableInstrumentsFetched(true);
          console.log('fetched');
        } catch (err) {
          console.error('Failed to fetch available instruments:', err);
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load available instruments'
          );
          setData([]);
        } finally {
          setAvailableInstrumentsLoading(false);
        }
      }
    };

    console.log('will call');
    fetchAvailable();
  }, []);

  // Filter available instruments based on search
  const getFilteredTickers = useCallback(() => {
    if (!filter) return availableInstruments;
    return availableInstruments.filter((ticker) =>
      ticker.toLowerCase().includes(filter.toLowerCase())
    );
  }, [availableInstruments, filter]);

  // Fetch instruments data
  const fetchData = useCallback(
    async (resetData = false) => {
      try {
        console.log('fetching data motherf, page', page, 'filter; ', filter);
        const token = await getToken();
        if (!token) throw new Error('No auth token available');

        setLoading(true);
        setError(null);

        const filteredTickers = getFilteredTickers();

        const response = await fetchInstrumentsOverview({
          tickers: filteredTickers.length > 0 ? filteredTickers : undefined,
          page,
          pageSize: perPage,
          sector,
          sortBy,
          sortDirection,
          token,
        });

        // Handle the API response structure
        const items = response.items || [];
        const total = response.total || 0;
        const pages = response.num_pages || 0;

        console.log(items);
        const instruments = convertToInstruments(items);

        if (resetData || page === 1) {
          setData(instruments);
        } else {
          setData((prev) => [...prev, ...instruments]);
        }

        setTotalItems(total);
        setNumPages(pages);
        setHasMore(page < pages);
      } catch (err) {
        console.error('Failed to fetch instruments:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load instruments'
        );
      } finally {
        setLoading(false);
      }
    },
    [page, perPage, sortBy, sortDirection, getFilteredTickers]
  );

  // useEffect(() => {
  //   if (availableInstrumentsFetched) {
  //     fetchData(true);
  //   }
  // }, [filter, fetchData]);

  // Fetch data when page changes (for pagination)
  useEffect(() => {
    if (availableInstrumentsFetched && page > 1) {
      fetchData(false);
    } else if (availableInstrumentsFetched && page === 1) {
      fetchData(false);
    }
  }, [page, fetchData]);

  // Initial data fetch
  useEffect(() => {
    if (availableInstrumentsFetched && page === 1) {
      fetchData(true);
    }
  }, [availableInstrumentsFetched, fetchData]);

  // const refetch = useCallback(() => {
  //   fetchData(true);
  // }, [fetchData]);

  return {
    data,
    loading,
    hasMore,
    availableInstruments,
    availableInstrumentsLoading,
    error,
    // refetch,
    totalItems,
    numPages,
  };
};

export default useInstruments;
