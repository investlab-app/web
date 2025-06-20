import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

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

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <span>Theme</span>
                  <Sun className="ml-auto h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute ml-auto h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
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
