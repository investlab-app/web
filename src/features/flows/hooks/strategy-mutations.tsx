import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  graphLangCreateMutation,
  graphLangDestroyMutation,
  graphLangListQueryKey,
  graphLangPartialUpdateMutation,
  graphLangRetrieveQueryKey,
  graphLangUpdateMutation,
} from '@/client/@tanstack/react-query.gen';

export function useStrategyMutations() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    ...graphLangDestroyMutation(),
    onSuccess: async () => {
      toast.success('Flow deleted successfully');
      await queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
      navigate({
        to: '/strategies',
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(t('flows.errors.delete_failed', { message }));
    },
  });

  const createMutation = useMutation({
    ...graphLangCreateMutation(),
    onSuccess: async (data) => {
      toast.success('Flow created successfully');
      await queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
      navigate({
        to: `/strategies/${data.id}`,
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(t('flows.errors.create_failed', { message }));
    },
  });

  const updateMutation = useMutation({
    ...graphLangUpdateMutation(),
    onSuccess: (data) => {
      toast.success('Flow updated successfully');
      queryClient.refetchQueries({
        queryKey: graphLangRetrieveQueryKey({ path: { id: data.id } }),
      });
      queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(t('flows.errors.update_failed', { message }));
    },
  });

  const patchNameMutation = useMutation({
    ...graphLangPartialUpdateMutation(),
    onSuccess: (data) => {
      toast.success('Flow name updated successfully');
      queryClient.refetchQueries({
        queryKey: graphLangRetrieveQueryKey({ path: { id: data.id } }),
      });
      queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
    },
    onError: () => {
      toast.error(t('flows.errors.update_name_failed'));
    },
  });

  return { deleteMutation, createMutation, updateMutation, patchNameMutation };
}
