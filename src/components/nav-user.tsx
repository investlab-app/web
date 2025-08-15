import { UserButton } from '@clerk/clerk-react';
import React from 'react';
import { Skeleton } from './ui/skeleton';
import type { useUser } from '@clerk/clerk-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface NavUserProps {
  user: NonNullable<ReturnType<typeof useUser>['user']>;
}

export function NavUser({ user }: NavUserProps) {
  const userButtonRef = React.useRef<HTMLDivElement>(null);

  const name = user.firstName || user.fullName || 'User';
  const email = user.primaryEmailAddress?.emailAddress || '';
  const handleClick = (e: React.MouseEvent) => {
    if (!userButtonRef.current?.contains(e.target as Node)) {
      const userButton = userButtonRef.current?.querySelector('button');
      if (userButton) {
        userButton.click();
      }
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={handleClick}
          className="cursor-pointer"
        >
          <div ref={userButtonRef} className="flex items-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonPopoverCard: {
                    marginTop: '-8px',
                    marginLeft: '-8px',
                    borderRadius: '6px',
                  },
                },
              }}
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight ml-2">
            <span className="truncate font-medium">{name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {email}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function NavUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-pointer">
          <div className="flex items-center">
            <div className="animate-pulse">
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight ml-2 gap-1">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-3" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
