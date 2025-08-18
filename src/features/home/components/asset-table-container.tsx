import { useTranslation } from 'react-i18next';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchOwnedShares } from '../queries/fetch-owned-shares';
import AssetTable from './asset-table';
import type { OwnedShareItem as Asset } from '../types/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { ErrorMessage } from '@/features/shared/components/error-message';

export const ownedSharesQueryOptions = queryOptions({
  queryKey: ['owned-shares'],
  queryFn: fetchOwnedShares,
});

const AssetTableContainer = () => {
  const { t } = useTranslation();
  const handleAssetPressed = (asset: Asset) => {
    void asset;
    // noop
  };

  const {
    data: ownedSharesData,
    isLoading,
    isError,
  } = useQuery(ownedSharesQueryOptions);

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('investor.owned_shares')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={t('common.error_loading_data')} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="text-xl font-semibold">
      <CardHeader>
        <CardTitle>{t('investor.owned_shares')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <AssetTable
            data={ownedSharesData?.owned_shares || []}
            onAssetPressed={handleAssetPressed}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AssetTableContainer;
