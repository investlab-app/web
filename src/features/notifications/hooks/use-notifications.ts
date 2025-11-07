// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// import {
//   notificationsMarkAllAsSeenCreate,
//   notificationsPartialUpdate,
// } from '@/client/sdk.gen';
// import {
//   notificationsListOptions,
//   notificationsUnseenCountRetrieveOptions,
// } from '@/client/@tanstack/react-query.gen';

// /**
//  * Fetch all notifications for the current user
//  */
// export function useNotifications() {
//   const { data, isLoading, error, refetch } = useQuery(
//     notificationsListOptions()
//   );

//   // Extract results from paginated response, defaulting to empty array
//   const notifications = data?.results ?? [];

//   return {
//     data: notifications,
//     isLoading,
//     error,
//     refetch,
//   };
// }

// /**
//  * Get count of unseen notifications
//  */
// export function useUnseenNotificationCount() {
//   const { data } = useQuery(notificationsUnseenCountRetrieveOptions());

//   return data;
// }

// /**
//  * Mark a single notification as seen
//  */
// export function useMarkNotificationAsSeen() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id: string) => {
//       const response = await notificationsPartialUpdate({
//         path: { id },
//         body: {
//           is_seen: true,
//         },
//         throwOnError: true,
//       });
//       return response.data;
//     },
//     onSuccess: () => {
//       void queryClient.invalidateQueries({
//         queryKey: notificationsListOptions().queryKey,
//       });
//       void queryClient.invalidateQueries({
//         queryKey: ['notifications', 'unseen_count'],
//       });
//     },
//     onError: (error) => {
//       console.error('Error marking notification as seen:', error);
//     },
//   });
// }

// /**
//  * Mark all notifications as seen
//  */
// export function useMarkAllNotificationsAsSeen() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async () => {
//       const response = await notificationsMarkAllAsSeenCreate({
//         throwOnError: true,
//       });
//       return response.data;
//     },
//     onSuccess: () => {
//       void queryClient.invalidateQueries({
//         queryKey: notificationsListOptions().queryKey,
//       });
//       void queryClient.invalidateQueries({
//         queryKey: ['notifications', 'unseen_count'],
//       });
//     },
//     onError: (error) => {
//       console.error('Error marking all notifications as seen:', error);
//     },
//   });
// }
