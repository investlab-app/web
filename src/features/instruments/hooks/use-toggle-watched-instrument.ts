import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
    onSuccess: (data) => {
      // Show toast notification
      if (data.data?.is_watched) {
        toast.success('Added to watchlist');
      } else {
        toast.success('Removed from watchlist');
      }

      // Invalidate instruments list to refresh the is_watched field
      queryClient.invalidateQueries({
        queryKey: [{ url: '/api/instruments/with-prices/' }],
      });
    },
    onError: () => {
      toast.error('Failed to update watchlist');
    },
  });
}
