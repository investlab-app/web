import { Link, useRouterState } from '@tanstack/react-router';
import type { LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
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
  icon: LucideIcon;
  target?: string;
  tooltip?: string;
}

export function NavMain({ items }: { items: Array<NavItem> }) {
  const { location } = useRouterState();
  return (
    <SidebarGroup className="overflow-hidden">
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.tooltip || item.title}
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
