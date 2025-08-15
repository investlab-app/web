import { Suspense } from 'react';
import { AppSidebar } from '@/features/shared/components/app-sidebar';
import { SiteHeader } from '@/features/shared/components/site-header';
import {
  SidebarInset,
  SidebarProvider,
} from '@/features/shared/components/ui/sidebar';
import AccountOverviewRibbon from '@/features/home/components/account-overview-ribbon';
import AssetAllocationContainer from '@/features/home/components/asset-allocation-container';
import { AccountValueChartContainer } from '@/features/home/components/account-value-chart-container';
import AssetTableContainer from '@/features/home/components/asset-table-container';

export const Home = () => (
  <SidebarProvider>
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-col gap-4 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <AccountOverviewRibbon />
        </Suspense>
        <div className=" grid grid-cols-1 xl:grid-cols-2 gap-4">
          <AssetAllocationContainer />
          <AccountValueChartContainer />
        </div>
        <AssetTableContainer />
      </div>
    </SidebarInset>
  </SidebarProvider>
);
