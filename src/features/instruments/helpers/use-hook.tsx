import {
  fetchAvailableInstruments,
  fetchInstrumentsOverview,
} from '@/remote/api';
import { convertToInstruments, type Instrument } from './instrument';
import { useQuery } from '@tanstack/react-query';

type UseInstrumentsHookOptions = {
  token: string;
  page?: number;
  pageSize?: number;
  sector?: string;
  sortBy?: string;
  sortDirection?: string;
  enabled?: boolean; // To control when the query runs
  filterQuery?: string; // New prop for search filtering
};

type UseInstrumentsHookResult = {
  instruments: Instrument[];
  totalInstruments: number;
  isLoading: boolean;
  isFetching: boolean; // Indicates if a fetch is currently in progress (even if cached data is shown)
  isError: boolean;
  error: Error | null;
  // No need for refetch, TanStack Query handles invalidation and refetching
  // implicitly based on query key changes or manual invalidation.
  // We can expose `refetch` from the useQuery if specifically needed for manual triggers.
};

export function useInstruments({
  token,
  page = 1,
  pageSize = 10,
  sector = '',
  sortBy = '',
  sortDirection = 'asc',
  enabled = true,
  filterQuery = '', // Initialize filterQuery
}: UseInstrumentsHookOptions): UseInstrumentsHookResult {
  // Query to fetch all available tickers once and cache them
  const {
    data: allAvailableTickers = [],
    isLoading: isLoadingAvailableTickers,
    isError: isErrorAvailableTickers,
    error: errorAvailableTickers,
  } = useQuery<string[], Error>({
    queryKey: ['allAvailableInstruments', token], // Key for all available instruments
    queryFn: () => fetchAvailableInstruments({ token }),
    enabled: enabled,
    staleTime: 1000 * 60 * 60, // Available tickers probably don't change often
  });

  // Filter available tickers based on the search query
  const filteredTickers = (allAvailableTickers || []).filter((ticker) =>
    ticker.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Query to fetch instruments overview based on filtered tickers and pagination
  const {
    data: overviewData,
    isLoading: isLoadingInstruments,
    isFetching: isFetchingInstruments,
    isError: isErrorInstruments,
    error: errorInstruments,
  } = useQuery<
    { data: Instrument[]; total: number }, // What the selector returns
    Error
  >({
    // Query key now depends on filteredTickers, page, pageSize, etc.
    // Ensure `filteredTickers.join(',')` is used to trigger refetch when filter changes
    queryKey: [
      'instrumentsOverview',
      token,
      page,
      pageSize,
      sector,
      sortBy,
      sortDirection,
      // If `filteredTickers` is a very large array, `join(',')` could be a large key.
      // For smaller sets, it's fine. For very large sets, you might hash it or
      // rely on `filterQuery` as part of the key.
      filterQuery, // Include filterQuery in key for clarity, though `filteredTickers` dependency usually handles it
    ],
    queryFn: async () => {
      // Only proceed if filtered tickers are available or search is empty
      if (filteredTickers.length === 0 && filterQuery !== '') {
        return { data: [], total: 0 };
      }

      const response = await fetchInstrumentsOverview({
        tickers: filteredTickers, // Use the filtered tickers
        page,
        pageSize,
        sector,
        sortBy,
        sortDirection,
        token,
      });
      return {
        data: convertToInstruments(response.data),
        total: response.total,
      };
    },
    // This `enabled` ensures this query only runs if:
    // 1. The hook itself is enabled.
    // 2. The `allAvailableTickers` query has finished loading AND:
    //    a. It either returned some tickers, OR
    //    b. The `filterQuery` is empty (meaning we want all initial tickers).
    enabled:
      enabled &&
      !isLoadingAvailableTickers &&
      (allAvailableTickers.length > 0 || filterQuery === ''),
    staleTime: 1000 * 60, // Data for one page can be stale for 1 minute
  });

  return {
    instruments: overviewData?.data || [],
    totalInstruments: overviewData?.total || 0,
    // isLoading is true if either availableTickers or instruments are loading
    isLoading: isLoadingAvailableTickers || isLoadingInstruments,
    isFetching: isFetchingInstruments,
    // isError is true if either availableTickers or instruments have an error
    isError: isErrorAvailableTickers || isErrorInstruments,
    error: errorAvailableTickers || errorInstruments,
  };
}
