import { Link, useRouterState } from '@tanstack/react-router';
import { WalletSection } from './wallet-section';
import type { LinkProps } from '@tanstack/react-router';
import type { Icon } from '@tabler/icons-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/features/shared/components/ui/sidebar';

export interface NavItem {
  title: string;
  to: LinkProps['to'];
  icon: Icon;
  target?: string;
}

export function NavMain({ items }: { items: Array<NavItem> }) {
  const { location } = useRouterState();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <WalletSection />
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                >
                  <Link to={item.to} target={item.target}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
