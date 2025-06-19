import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { baseUrl } from '@/features/shared/api';

export const useUnsubscribeFromSymbols = () => {

  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      symbols,
      connectionId,
    }: {
      symbols: Array<string>;
      connectionId: string;
    }) => {
      if (symbols.length === 0) {
        return { success: true, message: 'No symbols to unsubscribe from' };
      }
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${baseUrl}/api/sse/unsubscribe`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbols, connectionId }),
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
