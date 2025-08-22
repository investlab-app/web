import { AppSidebar } from './app-sidebar';
import { SiteHeader } from './site-header';
import { SidebarInset, SidebarProvider } from './ui/sidebar';
import { getCookie } from '@/features/transactions/utils/cookies';

interface AppFrameProps {
  children: React.ReactNode;
}

export default function AppFrame({ children }: AppFrameProps) {
  const defaultOpen = getCookie('sidebar_state') === 'true';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader className="sticky top-0 bg-[var(--background)]" />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
