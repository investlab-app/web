import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Star } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/features/shared/components/ui/sidebar';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { investorsMeRetrieveOptions } from '@/client/@tanstack/react-query.gen';

export function NavWatchedTickers() {
  const { t } = useTranslation();

  const { data: investor, isLoading } = useQuery(investorsMeRetrieveOptions());

  const watchedTickers = investor?.watching_instruments || [];

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          {t('common.watched', 'Watched')}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {[1, 2, 3].map((i) => (
              <SidebarMenuItem key={i}>
                <Skeleton className="h-8 w-full" />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (watchedTickers.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center gap-2">
        <Star className="h-4 w-4" />
        {t('common.watched', 'Watched')}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {watchedTickers.map((ticker) => (
            <SidebarMenuItem key={ticker}>
              <SidebarMenuButton asChild>
                <Link
                  to="/instruments/$instrumentId"
                  params={{ instrumentId: ticker }}
                  className="text-sm"
                >
                  <span>{ticker}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
