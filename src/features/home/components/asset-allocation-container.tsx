import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchAssetAllocation } from '../queries/fetch-asset-allocation';
import { AssetAllocationTile } from './asset-allocation-tile';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

const AssetAllocationContainer = () => {
  const { t } = useTranslation();
  const { getToken } = useAuth();

  const {
    data: assetAllocation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['asset-allocation'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Unauthenticated');
      }
      return fetchAssetAllocation(token);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('investor.asset_allocation')}</CardTitle>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t('investor.distribution')}
            </h3>
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
        </CardContent>
      </Card>
    );
  }

  if (isError || !assetAllocation) {
    return <div>Error fetching data</div>;
  }

  const assets: Array<[string, number]> = assetAllocation.allocations.map(
    (item) => [item.asset_class_display_name, item.value]
  );

  return (
    <AssetAllocationTile
      totalValue={assetAllocation.total_value}
      yearlyGain={assetAllocation.total_return_this_year}
      currency={t('common.currency')}
      assets={assets}
    />
  );
};

export default AssetAllocationContainer;
