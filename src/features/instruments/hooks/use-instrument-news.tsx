import { useQuery } from '@tanstack/react-query';
import { fetchInstrumentNews } from '../queries/fetch-instrument-news';

type UseInstrumentNewsOptions = {
  ticker: string;
  enabled?: boolean;
};

export const useInstrumentNews = ({
  ticker,
  enabled = true,
}: UseInstrumentNewsOptions) => {
  const {
    data: news = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['instrumentNews', ticker],
    queryFn: () => fetchInstrumentNews({ ticker }),
    enabled: enabled && !!ticker,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

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
