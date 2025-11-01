import { useSuspenseQuery } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

import { instrumentsListOptions } from '@/client/@tanstack/react-query.gen';
import { Button } from '@/features/shared/components/ui/button';
import { Checkbox } from '@/features/shared/components/ui/checkbox';
import { Input } from '@/features/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/shared/components/ui/select';

const createPriceAlertSchema = z.object({
  instrument_ticker: z.string().min(1, 'Symbol is required'),
  threshold_type: z.enum(['above', 'below']),
  threshold_value: z
    .string()
    .min(1, 'Price is required')
    .transform((val) => parseFloat(val))
    .refine(
      (val) => !Number.isNaN(val) && val > 0,
      'Price must be a valid number greater than 0'
    ),
  enable_notifications: z.boolean().default(true),
});

interface CreatePriceAlertFormProps {
  onSubmit: (data: {
    instrument_ticker: string;
    threshold_type: 'above' | 'below';
    threshold_value: string;
    notification_config: {
      is_active?: boolean;
      enable_email?: boolean;
      enable_in_app?: boolean;
    };
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreatePriceAlertForm({
  onSubmit,
  isSubmitting = false,
}: CreatePriceAlertFormProps) {
  const { t } = useTranslation();

  // Fetch instruments
  const { data: instruments } = useSuspenseQuery(instrumentsListOptions());

  const form = useForm({
    defaultValues: {
      instrument_ticker: '',
      threshold_type: 'above' as const,
      threshold_value: '',
      enable_notifications: true,
    },
    onSubmit: async ({ value }) => {
      const validationResult = createPriceAlertSchema.safeParse(value);
      if (!validationResult.success) {
        return;
      }

      await onSubmit({
        instrument_ticker: validationResult.data.instrument_ticker,
        threshold_type: validationResult.data.threshold_type,
        threshold_value: String(validationResult.data.threshold_value),
        notification_config: {
          is_active: validationResult.data.enable_notifications,
        },
      });
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Instrument Ticker */}
      <form.Field
        name="instrument_ticker"
        children={(field) => {
          const errors = field.state.meta.errors;
          return (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                {t('common.symbol', 'Symbol')}
              </label>
              <Select
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'price_alerts.select_symbol',
                      'Select a symbol'
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {instruments.results.map((instrument) => (
                    <SelectItem
                      key={String(instrument.ticker)}
                      value={String(instrument.ticker)}
                    >
                      {String(instrument.ticker)} - {String(instrument.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.length > 0 && (
                <p className="text-sm text-destructive">{errors[0]}</p>
              )}
            </div>
          );
        }}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Threshold Type */}
        <form.Field
          name="threshold_type"
          children={(field) => {
            const errors = field.state.meta.errors;
            return (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  {t('price_alerts.threshold_type', 'Alert When')}
                </label>
                <Select
                  value={String(field.state.value)}
                  onValueChange={(value) => {
                    if (value === 'above' || value === 'below') {
                      // @ts-ignore - TanStack Form type inference issue with union types
                      field.handleChange(value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">
                      {t('price_alerts.type_above', 'Price Goes Above')}
                    </SelectItem>
                    <SelectItem value="below">
                      {t('price_alerts.type_below', 'Price Goes Below')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.length > 0 && (
                  <p className="text-sm text-destructive">{errors[0]}</p>
                )}
              </div>
            );
          }}
        />

        {/* Threshold Value */}
        <form.Field
          name="threshold_value"
          children={(field) => {
            const errors = field.state.meta.errors;
            return (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  {t('price_alerts.threshold_value', 'Price ($)')}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {errors.length > 0 && (
                  <p className="text-sm text-destructive">{errors[0]}</p>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Enable Notifications */}
      <form.Field
        name="enable_notifications"
        children={(field) => (
          <div className="flex flex-row items-center space-x-3 space-y-0">
            <Checkbox
              checked={Boolean(field.state.value)}
              onCheckedChange={(checked) => {
                field.handleChange(Boolean(checked));
              }}
            />
            <div className="space-y-1 leading-none">
              <label htmlFor={field.name} className="text-sm font-medium">
                {t('price_alerts.enable_notifications', 'Enable Notifications')}
              </label>
              <p className="text-sm text-muted-foreground">
                {t(
                  'price_alerts.notifications_description',
                  'Receive notifications when the price alert triggers'
                )}
              </p>
            </div>
          </div>
        )}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('common.creating', 'Creating...')}
          </>
        ) : (
          t('price_alerts.create_alert', 'Create Alert')
        )}
      </Button>
    </form>
  );
}
