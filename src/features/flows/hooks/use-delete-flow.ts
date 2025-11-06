import { useMutation } from '@tanstack/react-query';
import { graphLangDestroyMutation } from '@/client/@tanstack/react-query.gen';

export function useDeleteFlow() {
  return useMutation({
    ...graphLangDestroyMutation(),
    onSuccess: () => {
      // TODO: Navigate back to flows list or show success message
      console.log('Flow deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete flow:', error);
      // TODO: Show error message to user
    },
  });
}
