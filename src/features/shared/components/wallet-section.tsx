import { IconPlus, IconWallet } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { authedQueryOptions } from '../utils/authed-query-options';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { fetchCurrentAccountValue } from '@/features/home/queries/fetch-current-account-value';
import { SidebarMenuButton, SidebarMenuItem } from '@/features/shared/components/ui/sidebar';

export const currentAccountValueQueryOptions = authedQueryOptions({
  queryKey: ['currentAccountValue'],
  queryFn: async (token) => {
    return fetchCurrentAccountValue(token);
  },
  staleTime: 60 * 1000,
});

export function WalletSection() {
  const { getToken } = useAuth();
  const { t } = useTranslation();

  const { data: accountValue, isLoading } = useQuery(
    currentAccountValueQueryOptions(getToken)
  );

  return (
    <SidebarMenuItem className="flex items-center gap-0">
      <SidebarMenuButton tooltip={t('common.wallet')}>
        <IconWallet />
        {isLoading ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <span>
            {accountValue ? (
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: t('common.currency'),
              }).format(accountValue)
            ) : (
              <Skeleton className="h-6 w-24" />
            )}
          </span>
        )}
      </SidebarMenuButton>
      <Button
        size="icon"
        className="size-8 group-data-[collapsible=icon] bg-primary active:bg-primary/90  hover:bg-primary/90 duration-200 ease-linear"
        aria-label={t('common.add')}
      >
        <IconPlus />
      </Button>
    </SidebarMenuItem>
  );
}
