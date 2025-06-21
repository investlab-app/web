import { AppSidebar } from '@/features/shared/components/app-sidebar';
import { SiteHeader } from '@/features/shared/components/site-header';
import {
  SidebarInset,
  SidebarProvider,
} from '@/features/shared/components/ui/sidebar';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';
import { AuthTestButton } from '@/features/login/components/auth-test-button';
import AccountOverviewRibbon from '@/features/home/components/account-overview-ribbon';
import AssetAllocationContainer from '@/features/home/components/asset-allocation-container';
import { AccuntValueChartContainer } from '@/features/home/components/account-value-chart-container';

export function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <AccountOverviewRibbon />
              <AssetAllocationContainer />
              <StockChartContainer ticker="aapl" />
              <AccuntValueChartContainer />
              <div className="flex flex-col items-center gap-4 px-4 lg:px-6">
                <AuthTestButton url="/api/test/admin_test" auth />
                <AuthTestButton url="/api/test/users_test" auth />
                <AuthTestButton url="/api/test/all_test" auth={false} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
