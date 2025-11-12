import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AssetAllocationTile } from './asset-allocation-tile';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { ErrorMessage } from '@/features/shared/components/error-message';
import { statisticsAssetAllocationRetrieveOptions } from '@/client/@tanstack/react-query.gen';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

export const AssetAllocationContainer = () => {
  const { t } = useTranslation();

  const { data, isPending, isSuccess } = useQuery(
    statisticsAssetAllocationRetrieveOptions({
      query: {
        instruments_number: 4,
      },
    })
  );

  if (!isSuccess) {
    if (isPending) {
      return <AssetAllocationContainerSkeleton />;
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('investor.asset_allocation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={t('common.error_loading_data')} />
        </CardContent>
      </Card>
    );
  }

  const allocations = data.allocations.map((allocation) => {
    if (allocation.instrument_name === 'Other') {
      return {
        ...allocation,
        instrument_name: '',
        instrument_ticker: t('investor.other_assets'),
      };
    }
    return allocation;
  });

  return (
    <AssetAllocationTile
      totalValue={data.total_value}
      yearlyGain={data.total_gain_this_year}
      assets={allocations}
    />
  );
};

export const AssetAllocationContainerSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-7 w-40 bg-muted rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-md animate-pulse mt-2" />
        <div className="h-4 w-24 bg-muted rounded-md animate-pulse mt-1" />
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          {/* Distribution section title */}
          <div className="h-6 w-32 bg-muted rounded-md animate-pulse" />

          {/* Distribution chart */}
          <div className="flex w-full gap-1 h-8 rounded-lg">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="rounded-md h-4 bg-muted animate-pulse"
                style={{ width: `${Math.random() * 30 + 10}%` }}
              />
            ))}
          </div>

          {/* Asset list */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-4 rounded-full" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
