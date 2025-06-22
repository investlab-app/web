import { WalletSection } from './wallet-section';
import type { Icon } from '@tabler/icons-react';
import type { LinkProps } from '@tanstack/react-router';
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
}

export function NavMain({ items }: { items: Array<NavItem> }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <WalletSection />
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} navigateTo={item.to}>
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
