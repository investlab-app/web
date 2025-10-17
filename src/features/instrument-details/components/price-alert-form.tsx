import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useTranslation } from 'react-i18next';
import type { PushSubscriptionData } from '@/features/shared/hooks/use-push-notifications';

import { Label } from '@/features/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/shared/components/ui/select';
import { Checkbox } from '@/features/shared/components/ui/checkbox';
import { usePushNotifications } from '@/features/shared/hooks/use-push-notifications';
import { useAppForm } from '@/features/shared/hooks/use-app-form';
import { NumberInput } from '@/features/shared/components/ui/number-input';
import { pricesPriceAlertCreate } from '@/client';

interface PriceAlertFormProps {
  ticker: string;
  onSuccess?: () => void;
}

interface CreateSubscriptionRequest {
  instrument_ticker: string;
  threshold_type: 'above' | 'below';
  threshold_value: number;
  notification_config: {
    is_email: boolean;
    is_push: boolean;
    is_websocket: boolean;
    push_subscription?: PushSubscriptionData;
  };
}

export function PriceAlertForm({ ticker, onSuccess }: PriceAlertFormProps) {
  const { subscribe } = usePushNotifications();
  const { t } = useTranslation();

  const form = useAppForm({
    defaultValues: {
      thresholdType: 'above' as 'above' | 'below',
      thresholdValue: 0,
      isEmail: false,
      isInApp: false,
      isPush: false,
    },
    onSubmit: async ({ value }) => {
      if (!value.isEmail && !value.isInApp && !value.isPush) {
        toast.error(
          t('instruments.price_alert.form.select_notification_method')
        );
        return;
      }

      let subscriptionData;
      if (value.isPush) {
        subscriptionData = await subscribe();
        if (!subscriptionData) {
          toast.error(
            t('instruments.price_alert.form.push_subscription_failed')
          );
          return;
        }
      }

      createSubscriptionMutation.mutate({
        instrument_ticker: ticker,
        threshold_type: value.thresholdType,
        threshold_value: value.thresholdValue,
        notification_config: {
          push_subscription: subscriptionData,
          is_email: value.isEmail,
          is_push: value.isPush,
          is_websocket: value.isInApp,
        },
      });
    },
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: (data: CreateSubscriptionRequest) =>
      pricesPriceAlertCreate({
        body: { ...data, threshold_value: data.threshold_value.toFixed(2) },
      }),
    onSuccess: () => {
      toast.success(
        t('instruments.price_alert.form.alert_created_successfully')
      );
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Error creating price alert:', error);
      toast.error(
        error instanceof Error
          ? t('instrumentDetails.priceAlert.creationError', {
              cause: error.message,
            })
          : t('instrumentDetails.priceAlert.creationError', {
              cause: 'Unknown error',
            })
      );
    },
  });

  return (
    <form.AppForm>
      <div className="space-y-4">
        <form.AppField
          name="thresholdType"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor="threshold-type">
                {t('instruments.price_alert.form.alert_type')}
              </Label>
              <Select
                value={field.state.value}
                onValueChange={(value: 'above' | 'below') =>
                  field.handleChange(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">
                    {t('instruments.price_alert.form.alert_when_above')}
                  </SelectItem>
                  <SelectItem value="below">
                    {t('instruments.price_alert.form.alert_when_below')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <form.AppField
          name="thresholdValue"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor="threshold-value">
                {t('instruments.price_alert.form.threshold_value')}
              </Label>
              <NumberInput
                id="threshold-value"
                min={0}
                placeholder={t(
                  'instruments.price_alert.form.enter_price_threshold'
                )}
                value={field.state.value}
                onValueChange={(value) => {
                  if (value !== undefined) {
                    field.handleChange(value);
                  }
                }}
                className="w-full"
              />
            </div>
          )}
        />
        <div className="space-y-3">
          <div className="font-medium">
            {t('instruments.price_alert.form.notification_methods')}
          </div>
          <form.AppField
            name="isInApp"
            children={(field) => (
              <div className="flex gap-2">
                <Checkbox
                  id="in-app-notification"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <Label htmlFor="in-app-notification" className="font-normal">
                  {t('instruments.price_alert.form.in_app_notification')}
                </Label>
              </div>
            )}
          />
          <form.AppField
            name="isPush"
            children={(field) => (
              <div className="flex gap-2">
                <Checkbox
                  id="push-notification"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <Label htmlFor="push-notification" className="font-normal">
                  {t('instruments.price_alert.form.push_notification')}
                </Label>
              </div>
            )}
          />
          <form.AppField
            name="isEmail"
            children={(field) => (
              <div className="flex gap-2">
                <Checkbox
                  id="email-notification"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <Label htmlFor="email-notification" className="font-normal">
                  {t('instruments.price_alert.form.email_notification')}
                </Label>
              </div>
            )}
          />
        </div>
        <form.SubmitButton className="w-full">
          {t('instruments.price_alert.form.create_alert')}
        </form.SubmitButton>
      </div>
    </form.AppForm>
  );
}
