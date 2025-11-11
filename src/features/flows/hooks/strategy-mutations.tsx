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

// Parsing the erros at the moment is non-existent, as I didn't yet consult error types with krzyzan
export function useStrategyMutations() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    ...graphLangDestroyMutation(),
    onSuccess: async () => {
      toast.success(t('flows.success.flow_deleted'));
      await queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
      navigate({
        to: '/strategies',
      });
    },
    onError: (error) => {
      const message = error;
      toast.error(t('flows.errors.delete_failed', { message }));
    },
  });

  const createMutation = useMutation({
    ...graphLangCreateMutation(),
    onSuccess: async (data) => {
      toast.success(t('flows.success.flow_created'));
      await queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
      navigate({
        to: `/strategies/${data.id}`,
      });
    },
    onError: (error) => {
      const message = error.non_field_errors;
      toast.error(t('flows.errors.create_failed', { message }));
    },
  });

  const updateMutation = useMutation({
    ...graphLangUpdateMutation(),
    onSuccess: (data) => {
      toast.success(t('flows.success.flow_updated'));
      queryClient.refetchQueries({
        queryKey: graphLangRetrieveQueryKey({ path: { id: data.id } }),
      });
      queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
    },
    onError: (error) => {
      const message = error.non_field_errors;
      toast.error(t('flows.errors.update_failed', { message }));
    },
  });

  const patchNameMutation = useMutation({
    ...graphLangPartialUpdateMutation(),
    onSuccess: (data) => {
      toast.success(t('flows.success.flow_name_updated'));
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
