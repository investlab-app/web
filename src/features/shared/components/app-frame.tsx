import { AppSidebar } from './app-sidebar';
import { SiteHeader } from './site-header';
import { SidebarProvider } from './ui/sidebar';
import { getCookie } from '@/features/transactions/utils/cookies';

interface AppFrameProps {
  children: React.ReactNode;
}

export default function AppFrame({ children }: AppFrameProps) {
  const defaultOpen = getCookie('sidebar_state') === 'true';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full overflow-x-auto">
        <SiteHeader />
        <div className="mt-[var(--header-height)] py-4 px-(--page-padding) [--page-padding:--spacing(4)]">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
