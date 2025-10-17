import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import AssetTable from './asset-table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { ErrorMessage } from '@/features/shared/components/error-message';
import { investorsMeOwnedSharesRetrieveOptions } from '@/client/@tanstack/react-query.gen';
import { EmptyMessage } from '@/features/shared/components/empty-message';

export const AssetTableContainer = () => {
  const { t } = useTranslation();
  const handleAssetPressed = (asset: OwnedShareItem) => {
    void asset;
    // noop
  };

  const {
    data: ownedSharesData,
    isPending,
    isError,
    isSuccess,
  } = useQuery(investorsMeOwnedSharesRetrieveOptions());

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('investor.owned_shares')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}
        {isError && <ErrorMessage message={t('common.error_loading_data')} />}
        {isSuccess && ownedSharesData.owned_shares.length === 0 && (
          <EmptyMessage message={t('investor.no_owned_shares')} />
        )}
        {isSuccess && ownedSharesData.owned_shares.length > 0 && (
          <AssetTable
            data={ownedSharesData.owned_shares}
            onAssetPressed={handleAssetPressed}
          />
        )}
      </CardContent>
    </Card>
  );
};
