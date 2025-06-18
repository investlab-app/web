import { StockChartContainer } from '../charts/components/stock-chart-container';
import AccountOverviewRibbon from './components/account-overview-ribbon';
import AssetAllocationContainer from './components/asset-allocation-container';
import { AccuntValueChartContainer } from './components/account-value-chart-container';
import { AppSidebar } from '@/components/app-sidebar';

import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AuthTestButton } from '@/features/login/components/auth-test-button';

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
