import { useTranslation } from 'react-i18next';
import React from 'react';
import { Link } from '@tanstack/react-router';
import { useUser } from '@clerk/clerk-react';
import {
  History,
  LayoutDashboardIcon,
  List,
  PieChart,
  Workflow,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';
import { Separator } from './ui/separator';
import { WalletSection } from './wallet-section';
import type { NavItem } from '@/features/shared/components/nav-main';
import { NavMain } from '@/features/shared/components/nav-main';
import {
  NavUser,
  NavUserSkeleton,
} from '@/features/shared/components/nav-user';
import { NavSecondary } from '@/features/shared/components/nav-secondary';
import { NavWatchedTickers } from '@/features/shared/components/nav-watched-tickers';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { user } = useUser();

  const { state } = useSidebar();

  const data: {
    navMain: Array<NavItem>;
    navSecondary: Array<NavItem>;
  } = {
    navMain: [
      {
        title: t('common.dashboard'),
        to: '/',
        icon: LayoutDashboardIcon,
        tooltip: t('common.tooltips.navigation.dashboard'),
      },
      {
        title: t('common.stocks'),
        to: '/instruments',
        icon: List,
        tooltip: t('common.tooltips.navigation.instruments'),
      },
      {
        title: t('common.strategies'),
        to: '/strategies',
        icon: Workflow,
        tooltip: t(
          'common.tooltips.navigation.strategies',
          'See and edit your saved automated strategies'
        ),
      },
      {
        title: t('common.transactions'),
        to: '/transactions',
        icon: History,
        tooltip: t('common.tooltips.navigation.transactions'),
      },
      {
        title: t('common.statistics'),
        to: '/statistics',
        icon: PieChart,
        tooltip: t('common.tooltips.navigation.statistics'),
      },
    ],
    navSecondary: [
      // {
      //   title: t('common.settings'),
      //   to: '/settings',
      //   icon: IconSettings,
      // },
    ],
  };

  return (
    <Sidebar {...props} className="overflow-hidden">
      <SidebarHeader className="border-b border-sidebar-border h-(--header-height) justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 pointer-events-none select-none">
              <InvestLabLogo className="ml-1.5" />
              {state !== 'collapsed' && (
                <span className="translate-y-[1px] font-black text-[16px]">
                  {t('common.app_name')}
                </span>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavWatchedTickers />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="px-0">
        <div
          className={`px-2 ${state === 'collapsed' ? 'space-y-2' : 'space-y-0'}`}
        >
          <WalletSection />
          {user ? <NavUser user={user} /> : <NavUserSkeleton />}
        </div>
        <div className={state === 'collapsed' ? 'hidden' : ''}>
          <Separator className="mb-2 bg-sidebar-border" />
          <div className="px-4 flex gap-4 whitespace-nowrap overflow-hidden">
            <Link
              to="/privacy-policy"
              target="_blank"
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('common.privacy_policy')}
            </Link>
            <Link
              to="/terms-of-service"
              target="_blank"
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('common.terms_of_service')}
            </Link>
            <Link
              to="/faq"
              target="_blank"
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('common.faq')}
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
