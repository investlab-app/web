import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  pricesPriceAlertCreate,
  pricesPriceAlertDestroy,
  pricesPriceAlertPartialUpdate,
} from '@/client/sdk.gen';
import { pricesPriceAlertListOptions } from '@/client/@tanstack/react-query.gen';

/**
 * Fetch all price alerts for the current user
 */
export function usePriceAlerts() {
  const { data, isLoading, error, refetch } = useQuery(
    pricesPriceAlertListOptions()
  );

  // Extract results from paginated response, defaulting to empty array
  const alerts = data?.results ?? [];

  return {
    data: alerts,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Create a new price alert
 */
export function useCreatePriceAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      instrument_ticker: string;
      threshold_type: 'above' | 'below';
      threshold_value: string;
      notification_config?: {
        is_active?: boolean;
        enable_email?: boolean;
        enable_in_app?: boolean;
      };
    }) => {
      const response = await pricesPriceAlertCreate({
        body: {
          instrument_ticker: data.instrument_ticker,
          threshold_type: data.threshold_type,
          threshold_value: data.threshold_value,
          notification_config: {
            is_email: data.notification_config?.enable_email ?? false,
            is_push: data.notification_config?.enable_in_app ?? false,
            is_websocket: data.notification_config?.enable_in_app ?? false,
          },
        },
        throwOnError: true,
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: pricesPriceAlertListOptions().queryKey,
      });
    },
    onError: (error) => {
      console.error('Error creating price alert:', error);
    },
  });
}

/**
 * Delete a price alert
 */
export function useDeletePriceAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await pricesPriceAlertDestroy({
        path: { id },
        throwOnError: true,
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: pricesPriceAlertListOptions().queryKey,
      });
    },
    onError: (error) => {
      console.error('Error deleting price alert:', error);
    },
  });
}

/**
 * Update a price alert
 */
export function useUpdatePriceAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        threshold_type?: 'above' | 'below';
        threshold_value?: string;
        notification_config?: {
          is_active?: boolean;
          enable_email?: boolean;
          enable_in_app?: boolean;
        };
      };
    }) => {
      const response = await pricesPriceAlertPartialUpdate({
        path: { id },
        body: {
          threshold_type: data.threshold_type,
          threshold_value: data.threshold_value,
          notification_config: data.notification_config
            ? {
                is_email: data.notification_config.enable_email,
                is_push: data.notification_config.enable_in_app,
                is_websocket: data.notification_config.enable_in_app,
              }
            : undefined,
        },
        throwOnError: true,
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: pricesPriceAlertListOptions().queryKey,
      });
    },
    onError: (error) => {
      console.error('Error updating price alert:', error);
    },
  });
}
