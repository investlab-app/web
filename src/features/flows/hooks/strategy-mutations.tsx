import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { parseErrorResponse } from '../utils/parse-error-response';
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
      toast.success(t('flows.success.flow_deleted'));
      await queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
      navigate({
        to: '/strategies',
      });
    },
    onError: (error) => {
      toast.error(
        t('flows.errors.delete_failed', { message: parseErrorResponse(error) })
      );
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
      toast.error(
        t('flows.errors.create_failed', { message: parseErrorResponse(error) })
      );
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
      toast.error(
        t('flows.errors.update_failed', { message: parseErrorResponse(error) })
      );
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

  const patchRepeatMutation = useMutation({
    ...graphLangPartialUpdateMutation(),
    onSuccess: (data) => {
      toast.success(
        data.repeat
          ? t('flows.success.flow_set_to_repeat')
          : t('flows.success.flow_set_to_single')
      );
      queryClient.refetchQueries({
        queryKey: graphLangRetrieveQueryKey({ path: { id: data.id } }),
      });
      queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
    },
    onError: () => {
      toast.error(t('flows.errors.update_repetition_failed'));
    },
  });

  return {
    deleteMutation,
    createMutation,
    updateMutation,
    patchNameMutation,
    patchRepeatMutation,
  };
}
