import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { graphLangDestroyMutation, graphLangListQueryKey } from '@/client/@tanstack/react-query.gen';

export function useDeleteFlow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    ...graphLangDestroyMutation(),
    onSuccess: () => {
      toast.success('Flow deleted successfully');
      queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
    },
    onError: (error) => {
      console.error('Failed to delete flow:', error);
      toast.error('Failed to delete flow');
    },
  });
}