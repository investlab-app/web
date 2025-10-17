import AccountOverviewRibbon from '@/features/home/components/account-overview-ribbon';
import AssetAllocationContainer from '@/features/home/components/asset-allocation-container';
import { AccountValueChartContainer } from '@/features/home/components/account-value-chart-container';
import { AssetTableContainer } from '@/features/home/components/asset-table-container';
import AppFrame from '@/features/shared/components/app-frame';

export function Dashboard() {
  return (
    <AppFrame>
      <div className="flex flex-col gap-4">
        <AccountOverviewRibbon />
        <div className=" grid grid-cols-1 xl:grid-cols-2 gap-4">
          <AssetAllocationContainer />
          <AccountValueChartContainer />
        </div>
        <AssetTableContainer />
      </div>
    </AppFrame>
  );
}
