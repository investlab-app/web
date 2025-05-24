import { createFileRoute } from '@tanstack/react-router';
import data from '../data.json';
import { AppSidebar } from '@/components/app-sidebar';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';

import { ClerkProvider } from '@clerk/tanstack-react-start'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AuthTestButton } from '@/components/auth-test-button';
import {
  SignedIn,
  UserButton,
  SignOutButton,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@clerk/tanstack-react-start'
import { ThemeProvider } from '@/components/theme-provider';

export const Route = createFileRoute('/')({
  component: App,
});


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

function App() {
  return (
    <ThemeProvider>
       <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" navigate={(to) => router.navigate({ to })}>
    <SignedIn>
      
    
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <AuthTestButton url="http://localhost:8000/api/admin_test" auth={true}></AuthTestButton>
      <AuthTestButton url="http://localhost:8000/api/users_test" auth={true}></AuthTestButton>
      <AuthTestButton url="http://localhost:8000/api/all_test" auth={false}></AuthTestButton>
    <UserButton />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={data} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    <p>You are signed in</p>
  </SignedIn>
  <SignedOut>
  <AuthTestButton url="http://localhost:8000/api/admin_test" auth={true}></AuthTestButton>
      <AuthTestButton url="http://localhost:8000/api/users_test" auth={true}></AuthTestButton>
      <AuthTestButton url="http://localhost:8000/api/all_test" auth={false}></AuthTestButton>
    <p>You are signed out</p>
    <SignInButton />
  </SignedOut>
  </ClerkProvider>
    </ThemeProvider>
  );
}
