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
import { AssetAllocationSkeleton } from './asset-allocation-skeleton';

const AssetAllocationContainer = () => {
  const { t } = useTranslation();

  const {
    data: assetAllocation,
    isPending,
    isError,
    isSuccess,
  } = useQuery(statisticsAssetAllocationRetrieveOptions());

  if (!isSuccess) {
    if (isPending) {
      return <AssetAllocationSkeleton />;
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

  return (
    <AssetAllocationTile
      totalValue={assetAllocation.total_value}
      yearlyGain={assetAllocation.total_gain_this_year}
      assets={assetAllocation.allocations}
    />
  );
};

export default AssetAllocationContainer;
