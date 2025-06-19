import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { baseUrl } from '@/features/shared/api';

export const useUnsubscribeFromSymbols = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (symbols: Array<string>) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${baseUrl}/sse/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbols }),
      });

      if (!response.ok) {
        throw new Error(
          `Unsubscription failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    },
  });
};
