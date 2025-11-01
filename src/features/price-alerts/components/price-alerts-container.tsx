import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader2, Plus } from 'lucide-react';

import {
  useCreatePriceAlert,
  useDeletePriceAlert,
  usePriceAlerts,
} from '../hooks/use-price-alerts';
import { CreatePriceAlertForm } from './create-price-alert-form';
import { PriceAlertsTable } from './price-alerts-table';
import { Button } from '@/features/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/components/ui/dialog';

export function PriceAlertsContainer() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Fetch price alerts
  const { data: alerts = [], isLoading } = usePriceAlerts();

  // Mutations
  const createMutation = useCreatePriceAlert();
  const deleteMutation = useDeletePriceAlert();

  const handleCreateAlert = async (data: {
    instrument_ticker: string;
    threshold_type: 'above' | 'below';
    threshold_value: string;
    notification_config: {
      is_active?: boolean;
      enable_email?: boolean;
      enable_in_app?: boolean;
    };
  }): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      createMutation.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          resolve();
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  const handleDeleteAlert = async (alertId: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      deleteMutation.mutate(alertId, {
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('price_alerts.title', 'Price Alerts')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t(
              'price_alerts.description',
              'Manage your price alerts and get notified when prices reach your target levels'
            )}
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('price_alerts.add_alert', 'Add Alert')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {t('price_alerts.create_new_alert', 'Create New Price Alert')}
              </DialogTitle>
              <DialogDescription>
                {t(
                  'price_alerts.form_description',
                  'Set up a price alert for a stock and get notified when the price reaches your target'
                )}
              </DialogDescription>
            </DialogHeader>
            <CreatePriceAlertForm
              onSubmit={handleCreateAlert}
              isSubmitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {alerts.length > 0 ? (
        <PriceAlertsTable
          alerts={alerts}
          onDelete={handleDeleteAlert}
          isDeleting={deleteMutation.isPending}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 gap-3 border rounded-lg">
          <AlertCircle className="h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            {t('price_alerts.empty_state', 'No price alerts yet')}
          </p>
          <Button variant="outline" onClick={() => setOpen(true)}>
            {t('price_alerts.create_first', 'Create your first alert')}
          </Button>
        </div>
      )}
    </div>
  );
}
