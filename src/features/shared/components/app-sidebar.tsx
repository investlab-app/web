import { useTranslation } from 'react-i18next';
import React from 'react';
import { Link } from '@tanstack/react-router';
import { useUser } from '@clerk/clerk-react';
import {
  HelpCircle,
  History,
  LayoutDashboardIcon,
  List,
  PieChart,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
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
  } = {
    navMain: [
      {
        title: t('common.dashboard'),
        to: '/',
        icon: LayoutDashboardIcon,
      },
      {
        title: t('common.stocks'),
        to: '/instruments',
        icon: List,
      },
      {
        title: t('common.transactions'),
        to: '/transactions',
        icon: History,
      },
      {
        title: t('common.statistics'),
        to: '/statistics',
        icon: PieChart,
      },
    ],
    navSecondary: [
      {
        title: t('common.settings'),
        to: '/settings',
        icon: Settings,
      },
      {
        title: t('common.help'),
        to: '/help',
        icon: HelpCircle,
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b h-(--header-height) justify-center">
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
      <SidebarFooter>
        {user ? <NavUser user={user} /> : <NavUserSkeleton />}
      </SidebarFooter>
    </Sidebar>
  );
}
