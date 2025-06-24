import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { fetchInstrumentNews } from '../queries/fetch-instrument-news';
import type { NewsResponse } from '../queries/fetch-instrument-news';

type UseInstrumentNewsOptions = {
  ticker: string;
  enabled?: boolean;
};

export const useInstrumentNews = ({
  ticker,
  enabled = true,
}: UseInstrumentNewsOptions) => {
  const { getToken } = useAuth();

  const {
    data: news = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['instrumentNews', ticker],
    queryFn: async (): Promise<NewsResponse> => {
      const token = await getToken();
      if (!token) throw new Error('No auth token available');
      return fetchInstrumentNews({ ticker, token });
    },
    enabled: enabled && !!ticker,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  console.log('error?');

  if (error) {
    console.error('ERROR=', error);
  }

  return {
    news,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};
