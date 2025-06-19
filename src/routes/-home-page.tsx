import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';
import { AuthTestButton } from '@/features/login/components/auth-test-button';
import data from '@/data.json';

export function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="flex flex-col items-center gap-4 px-4 lg:px-6">
                <AuthTestButton url="/api/test/admin_test" auth />
                <AuthTestButton url="/api/test/users_test" auth />
                <AuthTestButton url="/api/test/all_test" auth={false} />
              </div>
              <div className="px-4 lg:px-6">
                <StockChartContainer ticker="AAPL" />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
