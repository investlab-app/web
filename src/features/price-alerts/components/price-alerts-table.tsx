import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
} from 'lucide-react';

import type { PriceAlert } from '@/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/features/shared/components/ui/alert-dialog';
import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';

interface PriceAlertsTableProps {
  alerts: Array<PriceAlert>;
  isLoading?: boolean;
  onDelete?: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

export function PriceAlertsTable({
  alerts,
  isLoading = false,
  onDelete,
  isDeleting = false,
}: PriceAlertsTableProps) {
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDeleteConfirm = async () => {
    if (deleteId && onDelete) {
      setIsConfirming(true);
      try {
        await onDelete(deleteId);
        setDeleteId(null);
      } finally {
        setIsConfirming(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle className="h-12 w-12 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">
          {t('price_alerts.empty_state', 'No price alerts yet')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">
                {t('common.symbol', 'Symbol')}
              </TableHead>
              <TableHead>{t('common.name', 'Name')}</TableHead>
              <TableHead className="w-32">
                {t('price_alerts.threshold_type', 'Threshold Type')}
              </TableHead>
              <TableHead className="w-32">
                {t('price_alerts.threshold_value', 'Price')}
              </TableHead>
              <TableHead className="w-24">
                {t('common.status', 'Status')}
              </TableHead>
              <TableHead className="w-16 text-right">
                {t('common.actions', 'Actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">
                  {alert.instrument_ticker}
                </TableCell>
                <TableCell className="text-sm">
                  {alert.instrument_name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {alert.threshold_type === 'above' ? (
                      <ChevronUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className="capitalize">{alert.threshold_type}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono">
                  ${Number(alert.threshold_value).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      alert.notification_config.is_active
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {alert.notification_config.is_active
                      ? t('common.active', 'Active')
                      : t('common.inactive', 'Inactive')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(alert.id)}
                    disabled={isDeleting || isConfirming}
                    title={t('common.delete', 'Delete')}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('price_alerts.delete_alert', 'Delete Price Alert')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                'price_alerts.delete_alert_description',
                'Are you sure you want to delete this price alert? This action cannot be undone.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isConfirming}>
              {t('common.cancel', 'Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isConfirming}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isConfirming
                ? t('common.deleting', 'Deleting...')
                : t('common.delete', 'Delete')}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
