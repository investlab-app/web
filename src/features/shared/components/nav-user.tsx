import { UserButton, useUser } from '@clerk/clerk-react';
import React from 'react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/features/shared/components/ui/sidebar';

export function NavUser() {
  const { user, isLoaded } = useUser();
  const userButtonRef = React.useRef<HTMLDivElement>(null);

  if (!isLoaded || !user) return null;

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
