import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { graphLangCreateMutation, graphLangDestroyMutation, graphLangListQueryKey, graphLangPartialUpdateMutation, graphLangRetrieveQueryKey, graphLangUpdateMutation } from "@/client/@tanstack/react-query.gen";

export function useStrategyMutations() {

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
      console.error('Failed to delete flow:', error);
      toast.error('Failed to delete flow');
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
      console.error('Failed to create flow:', error);
      toast.error('Failed to create flow');
    },
  });

  const updateMutation = useMutation({
    ...graphLangUpdateMutation(),
    onSuccess: (data) => {
      toast.success('Flow updated successfully');
            queryClient.refetchQueries({ queryKey: graphLangRetrieveQueryKey({path: {id: data.id}}) });
      queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
    },
    onError: (error) => {
      console.error('Failed to update flow:', error);
      toast.error('Failed to update flow');
    },
  });

  const patchNameMutation = useMutation({
    ...graphLangPartialUpdateMutation(),
    onSuccess: () => {
      toast.success('Flow name updated successfully');
      queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
    },
    onError: () => {
      toast.error('Failed to update flow name');
    },
  });


    return { deleteMutation, createMutation, updateMutation, patchNameMutation };
}