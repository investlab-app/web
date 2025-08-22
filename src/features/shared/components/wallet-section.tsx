import { IconPlus, IconWallet } from '@tabler/icons-react';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { fetchCurrentAccountValue } from '@/features/home/queries/fetch-current-account-value';
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/features/shared/components/ui/sidebar';

export const currentAccountValueQueryOptions = queryOptions({
  queryKey: ['currentAccountValue'],
  queryFn: fetchCurrentAccountValue,
  staleTime: 60 * 1000,
});

export function WalletSection() {
  const { t } = useTranslation();

  const {
    data: accountValue,
    isPending,
    isError,
    isSuccess,
  } = useQuery(currentAccountValueQueryOptions);

  return (
    <SidebarMenuItem className="flex items-center gap-1">
      <SidebarMenuButton tooltip={t('common.wallet')} asChild>
        <a>
          <IconWallet />
          {isPending && <Skeleton className="h-6 w-24" />}
          {isError && <Skeleton className="h-6 w-24" />}
          {isSuccess &&
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: t('common.currency'),
            }).format(accountValue.value)}
        </a>
      </SidebarMenuButton>
      <Button
        size="icon"
        className="size-8 group-data-[collapsible=icon] bg-primary active:bg-primary/90  hover:bg-primary/90 duration-200 ease-linear"
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
        <IconPlus />
      </Button>
    </SidebarMenuItem>
  );
}
