import { cn } from '../utils/styles';
import { AppSidebar } from './app-sidebar';
import { SiteHeader } from './site-header';
import { SidebarProvider } from './ui/sidebar';
import { getCookie } from '@/features/shared/utils/cookies';

interface AppFrameProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppFrame({ children, className }: AppFrameProps) {
  const defaultOpen = getCookie('sidebar_state') === 'true';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar collapsible="icon" />
      <main className="w-full overflow-x-auto">
        <SiteHeader />
        <div
          className={cn(
            'mt-[var(--header-height)] py-4 px-(--page-padding) [--page-padding:--spacing(4)]',
            className
          )}
        >
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
