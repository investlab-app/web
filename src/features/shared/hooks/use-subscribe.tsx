import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { baseUrl } from '@/features/shared/api';

export const useSubscribeToSymbols = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      symbols,
      connectionId,
    }: {
      symbols: Array<string>;
      connectionId: string;
    }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      console.log(
        `Subscribing to symbols: ${symbols.join(', ')} with connection ID: ${connectionId}`
      );

      const response = await fetch(`${baseUrl}/api/sse/subscribe`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbols, connectionId }),
      });

      if (!response.ok) {
        throw new Error(
          `Subscription failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    },
  });
};
