import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { fetchAvailableInstruments } from '@/features/shared/api';

export const useAvailableInstruments = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['availableInstruments'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No auth token available');
      return fetchAvailableInstruments({ token });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
