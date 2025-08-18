import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { AppSidebar } from '@/features/shared/components/app-sidebar';
import { SiteHeader } from '@/features/shared/components/site-header';
import {
  SidebarInset,
  SidebarProvider,
} from '@/features/shared/components/ui/sidebar';

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.userId) {
      throw redirect({ to: '/' });
    }
  },
  component: () => (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
});
