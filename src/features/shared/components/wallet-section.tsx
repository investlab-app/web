import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { toFixedLocalized } from '../utils/numbers';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/features/shared/components/ui/sidebar';
import { DepositDialog } from '@/features/wallet/components/deposit-dialog';
import { investorsMeRetrieveOptions } from '@/client/@tanstack/react-query.gen';

export function WalletSection() {
  const { i18n, t } = useTranslation();
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);

  const {
    data: accountValue,
    isPending,
    isError,
    isSuccess,
  } = useQuery(investorsMeRetrieveOptions());

  return (
    <>
      <SidebarMenuItem className="flex items-center gap-1">
        <SidebarMenuButton
          className="active:bg-transparent hover:bg-transparent cursor-default"
          asChild
          tooltip={
            isSuccess
              ? `${t('common.wallet')}: ${toFixedLocalized(parseFloat(accountValue.balance), i18n.language, 2)}`
              : t('common.wallet')
          }
        >
          <div className="flex items-center gap-2 h-12 ml-1">
            <Wallet />
            {isPending && <Skeleton className="h-6 w-24" />}
            {isError && <Skeleton className="h-6 w-24" />}
            {isSuccess &&
              toFixedLocalized(
                parseFloat(accountValue.balance),
                i18n.language,
                2
              )}
          </div>
        </SidebarMenuButton>
        <Button
          size="icon"
          className="ml-auto size-8 group-data-[collapsible=icon]:bg-primary active:bg-primary/90 hover:bg-primary/90 duration-200 ease-linear"
          aria-label={t('common.add')}
          onClick={() => setDepositDialogOpen(true)}
        >
          <Plus />
        </Button>
      </SidebarMenuItem>

      <DepositDialog
        open={depositDialogOpen}
        onOpenChange={setDepositDialogOpen}
      />
    </>
  );
}
