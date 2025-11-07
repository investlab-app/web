import { StatTile } from '@/features/shared/components/stat-tile';
import { AssetAllocationSkeleton } from '@/features/home/components/asset-allocation-skeleton';
import { AccountValueChartContainerSkeleton } from '@/features/home/components/account-value-chart-container';
import { AssetTableSkeleton } from '@/features/home/components/asset-table-skeleton';
import AppFrame from '@/features/shared/components/app-frame';

export const DashboardPending = () => {
  return (
    <AppFrame>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatTile.Skeleton key={`account-skeleton-${index}`} />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <AssetAllocationSkeleton />
          <AccountValueChartContainerSkeleton />
        </div>
        <AssetTableSkeleton />
      </div>
    </AppFrame>
  );
};
