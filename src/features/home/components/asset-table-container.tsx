import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import AssetTable from './asset-table';
import { AssetTableSkeleton } from './asset-table-skeleton';
import type { OwnedShare } from '@/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { ErrorMessage } from '@/features/shared/components/error-message';
import { statisticsOwnedSharesListOptions } from '@/client/@tanstack/react-query.gen';
import { EmptyMessage } from '@/features/shared/components/empty-message';

export const AssetTableContainer = () => {
  const { t } = useTranslation();
  const handleAssetPressed = (asset: OwnedShare) => {
    void asset;
    // noop
  };

  const {
    data: ownedSharesData,
    isPending,
    isError,
    isSuccess,
  } = useQuery(statisticsOwnedSharesListOptions());

  if (isPending) {
    return <AssetTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('investor.owned_shares')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isError && <ErrorMessage message={t('common.error_loading_data')} />}
        {isSuccess && ownedSharesData.length === 0 && (
          <EmptyMessage message={t('investor.no_owned_shares')} />
        )}
        {isSuccess && ownedSharesData.length > 0 && (
          <AssetTable
            data={ownedSharesData}
            onAssetPressed={handleAssetPressed}
            className="border border-muted"
          />
        )}
      </CardContent>
    </Card>
  );
};
