import { IconPlus, IconWallet } from '@tabler/icons-react';
import { Button } from './ui/button';
import type { Icon } from '@tabler/icons-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: Array<{
    title: string;
    url: string;
    icon?: Icon;
  }>;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-0">
            <SidebarMenuButton
              tooltip="Wallet"
              className="text-primary-foreground"
            >
              <IconWallet />
              <span>$9999.00</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon] bg-primary active:bg-primary/90  hover:bg-primary/90 duration-200 ease-linear"
            >
              <IconPlus />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} navigateTo={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
