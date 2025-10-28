import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AssetAllocationTile } from './asset-allocation-tile';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { ErrorMessage } from '@/features/shared/components/error-message';
import { statisticsAssetAllocationRetrieveOptions } from '@/client/@tanstack/react-query.gen';

const AssetAllocationContainer = () => {
  const { t } = useTranslation();

  const {
    data: assetAllocation,
    isPending,
    isError,
    isSuccess,
  } = useQuery(statisticsAssetAllocationRetrieveOptions());

  if (!isSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('investor.asset_allocation')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="space-y-4">
              <Skeleton className="h-5 w-18" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-10" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {isError && <ErrorMessage message={t('common.error_loading_data')} />}
        </CardContent>
      </Card>
    );
  }

  return (
    <AssetAllocationTile
      totalValue={assetAllocation.total_value}
      yearlyGain={assetAllocation.total_gain_this_year}
      assets={assetAllocation.allocations}
    />
  );
};

export default AssetAllocationContainer;
