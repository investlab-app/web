import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  notificationsMarkAllAsSeenCreate,
  notificationsPartialUpdate,
  notificationsUnseenCountRetrieve,
} from '@/client/sdk.gen';
import { notificationsListOptions } from '@/client/@tanstack/react-query.gen';

/**
 * Fetch all notifications for the current user
 */
export function useNotifications() {
  const { data, isLoading, error, refetch } = useQuery(
    notificationsListOptions()
  );

  // Extract results from paginated response, defaulting to empty array
  const notifications = data?.results ?? [];

  return {
    data: notifications,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Get count of unseen notifications
 */
export function useUnseenNotificationCount() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications', 'unseen_count'],
    queryFn: async () => {
      const response = await notificationsUnseenCountRetrieve({
        throwOnError: true,
      });
      // The response contains unseen_count from the backend
      interface UnseenCountResponse {
        unseen_count: number;
      }
      const responseData = response.data as unknown as UnseenCountResponse;
      return responseData.unseen_count;
    },
  });

  return {
    count: data ?? 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Mark a single notification as seen
 */
export function useMarkNotificationAsSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationsPartialUpdate({
        path: { id },
        body: {
          is_seen: true,
        },
        throwOnError: true,
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: notificationsListOptions().queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: ['notifications', 'unseen_count'],
      });
    },
    onError: (error) => {
      console.error('Error marking notification as seen:', error);
    },
  });
}

/**
 * Mark all notifications as seen
 */
export function useMarkAllNotificationsAsSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await notificationsMarkAllAsSeenCreate({
        throwOnError: true,
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: notificationsListOptions().queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: ['notifications', 'unseen_count'],
      });
    },
    onError: (error) => {
      console.error('Error marking all notifications as seen:', error);
    },
  });
}
