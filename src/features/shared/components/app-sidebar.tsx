import {
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSettings,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import type { NavItem } from '@/features/shared/components/nav-main';
import { NavMain } from '@/features/shared/components/nav-main';
import { NavUser } from '@/features/shared/components/nav-user';
import * as sidebar from '@/features/shared/components/ui/sidebar';
import { NavSecondary } from '@/features/shared/components/nav-secondary';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';

export function AppSidebar(
  props: React.ComponentProps<typeof sidebar.Sidebar>
) {
  const { t } = useTranslation();
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
    <sidebar.Sidebar {...props}>
      <sidebar.SidebarHeader>
        <sidebar.SidebarMenu>
          <sidebar.SidebarMenuItem>
            <sidebar.SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <InvestLabLogo className="!size-5" />
                <span className="text-base font-semibold">
                  {t('common.app_name')}
                </span>
              </a>
            </sidebar.SidebarMenuButton>
          </sidebar.SidebarMenuItem>
        </sidebar.SidebarMenu>
      </sidebar.SidebarHeader>
      <sidebar.SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </sidebar.SidebarContent>
      <sidebar.SidebarFooter>
        <NavUser />
      </sidebar.SidebarFooter>
    </sidebar.Sidebar>
  );
}
