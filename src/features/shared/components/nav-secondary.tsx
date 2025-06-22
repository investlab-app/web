import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import type { NavItem } from './nav-main';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/features/shared/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/shared/components/ui/dropdown-menu';
import { useTheme } from '@/features/shared/components/theme-provider';

export function NavSecondary({
  items,
  ...props
}: {
  items: Array<NavItem>;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.to}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
