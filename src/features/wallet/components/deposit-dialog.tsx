import { useState } from 'react';
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
import { Input } from '@/features/shared/components/ui/input';
import { Label } from '@/features/shared/components/ui/label';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DepositResult {
  success: boolean;
  amount: number;
}

export function DepositDialog({ open, onOpenChange }: DepositDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');

  const depositMutation = useMutation<DepositResult, Error, string>({
    mutationFn: async (depositAmount: string): Promise<DepositResult> => {
      const numAmount = parseFloat(depositAmount);

      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error(t('wallet.invalid_amount'));
      }

      // TODO: Replace with actual API call when backend endpoint is ready
      // For now, we'll just update the local state
      console.log('Deposit attempt:', numAmount);

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, amount: numAmount });
        }, 500);
      });
    },
    onSuccess: (data: DepositResult) => {
      toast.success(
        t('wallet.deposit_success', {
          defaultValue: `Successfully deposited $${data.amount.toFixed(2)}`,
          amount: data.amount.toFixed(2),
        })
      );

      // Invalidate investor query to refresh balance
      queryClient.invalidateQueries({
        queryKey: ['investors', 'me'],
      });

      setAmount('');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('common.something_went_wrong'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    depositMutation.mutate(amount);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!depositMutation.isPending) {
      setAmount('');
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('wallet.deposit_funds')}</DialogTitle>
          <DialogDescription>
            {t('wallet.deposit_description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deposit-amount">{t('wallet.amount')}</Label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">$</span>
              <Input
                id="deposit-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder={t('wallet.enter_amount')}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={depositMutation.isPending}
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('wallet.minimum_deposit')}
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={depositMutation.isPending}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={
                !amount || parseFloat(amount) <= 0 || depositMutation.isPending
              }
            >
              {depositMutation.isPending
                ? t('common.loading')
                : t('wallet.deposit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
