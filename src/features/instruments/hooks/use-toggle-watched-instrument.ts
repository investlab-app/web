import { useMutation, useQueryClient } from '@tanstack/react-query';
import { investorsMeWatchedInstrumentsToggleCreate } from '@/client/sdk.gen';

export function useToggleWatchedInstrument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (instrumentId: string) => {
      return investorsMeWatchedInstrumentsToggleCreate({
        path: {
          instrument_id: instrumentId,
        },
      });
    },
    onSuccess: () => {
      // Invalidate instruments list to refresh the is_watched field
      queryClient.invalidateQueries({
        queryKey: [{ url: '/api/instruments/with-prices/' }],
      });
    },
  });
}
