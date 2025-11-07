import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/features/shared/components/ui/dialog';
import { Button } from '@/features/shared/components/ui/button';
import { Label } from '@/features/shared/components/ui/label';
import { useAppForm } from '@/features/shared/hooks/use-app-form';
import {
  investorsDepositCreateMutation,
  investorsMeRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositDialog({ open, onOpenChange }: DepositDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      amount: 5,
    },
    onSubmit: ({ value }) => {
      if (value.amount <= 1 || value.amount > 100) {
        toast.error(
          t('wallet.invalid_amount', {
            defaultValue: 'Amount must be between $1 and $100',
          })
        );
        return;
      }

      depositMutation.mutate({
        body: { amount: value.amount.toString() },
      });
    },
  });

  const depositMutation = useMutation({
    ...investorsDepositCreateMutation(),
    onSuccess: (data) => {
      const amount =
        typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
      toast.success(
        t('wallet.deposit_success', {
          defaultValue: `Successfully deposited $${amount.toFixed(2)}`,
          amount: amount.toFixed(2),
        })
      );

      // Invalidate investor query to refresh balance
      queryClient.invalidateQueries({
        queryKey: investorsMeRetrieveOptions().queryKey,
      });

      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Deposit failed:', error);
      toast.error(error.message || t('common.something_went_wrong'));
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!depositMutation.isPending) {
      form.reset();
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('wallet.deposit_funds')}</DialogTitle>
          <DialogDescription>
            {t('wallet.deposit_description', {
              defaultValue: 'Add funds to your paper trading account.',
            })}
          </DialogDescription>
        </DialogHeader>

        <form.AppForm>
          <div className="space-y-6">
            <form.AppField
              name="amount"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">
                    {t('wallet.amount', { defaultValue: 'Amount' })}
                  </Label>
                  <field.NumberInput
                    id="deposit-amount"
                    min={1}
                    max={100}
                    decimalScale={2}
                    fixedDecimalScale
                    placeholder={t('wallet.enter_amount', {
                      defaultValue: 'Enter amount',
                    })}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('wallet.minimum_deposit', { amount: 1 })}
                  </p>
                </div>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={depositMutation.isPending}
              >
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </Button>
              <form.SubmitButton>
                {t('wallet.deposit', { defaultValue: 'Deposit' })}
              </form.SubmitButton>
            </DialogFooter>
          </div>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
