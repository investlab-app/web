import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Plus, Wallet } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/features/shared/components/ui/sidebar';
import { investorsMeRetrieveOptions } from '@/client/@tanstack/react-query.gen';

export function WalletSection() {
  const { t } = useTranslation();

  const {
    data: accountValue,
    isPending,
    isError,
    isSuccess,
  } = useQuery(investorsMeRetrieveOptions());

  return (
    <SidebarMenuItem className="flex items-center gap-1">
      <SidebarMenuButton tooltip={t('common.wallet')} asChild>
        <div className="flex items-center justify-between">
          <Wallet />
          {isPending && <Skeleton className="h-6 w-24" />}
          {isError && <Skeleton className="h-6 w-24" />}
          {isSuccess &&
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: t('common.currency'),
            }).format(parseFloat(accountValue.balance))}
          <Button
            size="icon"
            className="ml-auto size-8 group-data-[collapsible=icon] bg-primary active:bg-primary/90  hover:bg-primary/90 duration-200 ease-linear"
            aria-label={t('common.add')}
            onClick={() =>
              toast('Wallet clicked!', {
                duration: Infinity,
                action: {
                  label: 'Close',
                  onClick: () => console.log('Close'),
                },
              })
            }
          >
            <Plus />
          </Button>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
