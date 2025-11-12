import { StatTile } from '@/features/shared/components/stat-tile';
import { AccountValueChartContainerSkeleton } from '@/features/home/components/account-value-chart-container';
import AppFrame from '@/features/shared/components/app-frame';
import { AssetTableContainerSkeleton } from '@/features/home/components/asset-table-container';
import { AssetAllocationContainerSkeleton } from '@/features/home/components/asset-allocation-container';

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
          <AssetAllocationContainerSkeleton />
          <AccountValueChartContainerSkeleton />
        </div>
        <AssetTableContainerSkeleton />
      </div>
    </AppFrame>
  );
};
