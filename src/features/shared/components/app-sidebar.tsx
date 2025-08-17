import {
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSettings,
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
import type { NavItem } from '@/features/shared/components/nav-main';
import { NavMain } from '@/features/shared/components/nav-main';
import { NavUser, NavUserSkeleton } from '@/features/shared/components/nav-user';
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
        icon: IconDashboard,
      },
      {
        title: t('common.stocks'),
        to: '/instruments',
        icon: IconListDetails,
      },
    ],
    navSecondary: [
      {
        title: t('common.settings'),
        to: '/',
        icon: IconSettings,
      },
      {
        title: t('common.help'),
        to: '/',
        icon: IconHelp,
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <InvestLabLogo className="!size-5" />
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
