import {
  IconChartPie,
  IconDashboard,
  IconHelp,
  IconHistory,
  IconListDetails,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Link } from '@tanstack/react-router';
import { useUser } from '@clerk/clerk-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { Separator } from './ui/separator';
import type { NavItem } from '@/features/shared/components/nav-main';
import { NavMain } from '@/features/shared/components/nav-main';
import {
  NavUser,
  NavUserSkeleton,
} from '@/features/shared/components/nav-user';
import { NavSecondary } from '@/features/shared/components/nav-secondary';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { user } = useUser();
  const data: {
    navMain: Array<NavItem>;
    navSecondary: Array<NavItem>;
    legal: Array<NavItem>;
  } = {
    navMain: [
      {
        title: t('common.dashboard'),
        to: '/',
        icon: IconDashboard,
      },
      {
        title: t('common.stocks'),
        to: '/instruments',
        icon: IconListDetails,
      },
      {
        title: t('common.transactions'),
        to: '/transactions',
        icon: IconHistory,
      },
      {
        title: t('common.statistics'),
        to: '/statistics',
        icon: IconChartPie,
      },
    ],
    navSecondary: [
      // {
      //   title: t('common.settings'),
      //   to: '/settings',
      //   icon: IconSettings,
      // },
    ],
    legal: [
      {
        title: t('common.privacy_policy'),
        to: '/privacy-policy',
        target: '_blank',
        icon: IconHelp,
      },
      {
        title: t('common.terms_of_service'),
        to: '/terms-of-service',
        target: '_blank',
        icon: IconHelp,
      },
      {
        title: t('common.faq'),
        to: '/faq',
        target: '_blank',
        icon: IconHelp,
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border h-(--header-height) justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/" className="gap-2">
                <InvestLabLogo className="!size-5 -mt-1" />
                <span className="text-base font-semibold">
                  {t('common.app_name')}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="px-0">
        <div className="px-2">
          {user ? <NavUser user={user} /> : <NavUserSkeleton />}
        </div>
        <div>
          <Separator className="mb-2 bg-sidebar-border" />
          <div className="px-4 flex gap-4">
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
