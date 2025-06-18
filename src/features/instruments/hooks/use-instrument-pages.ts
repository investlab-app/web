import { useQueries } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { fetchInstrumentsOverview } from '@/remote/api';
import { convertToInstruments } from '../helpers/instrument';
import { type InstrumentsPageData } from '../types/instruments.types';

type UseInstrumentPagesProps = {
  tickers: string[];
  page: number;
  perPage: number;
  sector?: string;
  sortBy?: string;
  sortDirection?: string;
};

export const useInstrumentPages = ({
  tickers,
  page,
  perPage,
  sector,
  sortBy,
  sortDirection,
}: UseInstrumentPagesProps) => {
  const { getToken } = useAuth();

  const pagesToFetch = Array.from({ length: page }, (_, i) => i + 1);

  return useQueries({
    queries: pagesToFetch.map((pageNum) => ({
      queryKey: [
        'instruments',
        {
          tickers,
          page: pageNum,
          perPage,
          sector,
          sortBy,
          sortDirection,
        },
      ],
      queryFn: async (): Promise<InstrumentsPageData> => {
        console.log(`Fetching tickers ${tickers}`);
        const token = await getToken();
        if (!token) throw new Error('No auth token available');

        console.log(`Token: ${token}`);

        const response = await fetchInstrumentsOverview({
          tickers: tickers.length > 0 ? tickers : undefined,
          page: pageNum,
          pageSize: perPage,
          sector,
          sortBy,
          sortDirection,
          token,
        });

        console.log(response);

        return {
          instruments: convertToInstruments(response.items || []),
          total: response.total || 0,
          numPages: response.num_pages || 0,
          page: pageNum,
        };
      },
      enabled: tickers.length > 0 || !tickers,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
    })),
  });
};
