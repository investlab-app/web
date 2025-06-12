import { UserButton, useUser } from '@clerk/clerk-react';
import { useRef } from 'react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavUser() {
  const { user, isLoaded } = useUser();
  const userButtonRef = useRef<HTMLDivElement>(null);

  if (!isLoaded || !user) return null;

  const name = user.firstName || user.fullName || 'User';
  const email = user.primaryEmailAddress?.emailAddress || '';
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if the click wasn't on the UserButton itself
    if (!userButtonRef.current?.contains(e.target as Node)) {
      const userButton = userButtonRef.current?.querySelector('button');
      if (userButton) {
        userButton.click();
      }
    }
  };

  const handleUserButtonClick = (e: React.MouseEvent) => {
    // Prevent the parent button's click handler from firing
    e.stopPropagation();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={handleClick}
          className="cursor-pointer"
        >
          <div ref={userButtonRef} onClick={handleUserButtonClick}>
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
