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
import { Message } from '@/features/shared/components/error-message';
import { investorsMeOwnedSharesRetrieveOptions } from '@/client/@tanstack/react-query.gen';
import { investorsMeOwnedSharesRetrieve } from '@/client';

const AssetTableContainer = () => {
  const { t } = useTranslation();
  const handleAssetPressed = (asset: OwnedShareItem) => {
    void asset;
    // noop
  };

  const {
    data: ownedSharesData,
    isPending,
    isError,
  } = useQuery(investorsMeOwnedSharesRetrieveOptions())

  if (isError) {
    return <AssetTableContainer.Error />;
  }

  if (isPending) {
    return <AssetTableContainer.Skeleton />;
  }

  return (
    <Card className="text-xl">
      <CardHeader>
        <CardTitle>{t('investor.owned_shares')}</CardTitle>
      </CardHeader>
      <CardContent>
        <AssetTable
          data={ownedSharesData.owned_shares}
          onAssetPressed={handleAssetPressed}
        />
      </CardContent>
    </Card>
  );
};

function AssetTableContainerSkeleton() {
  return (
    <Card className="text-xl">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function AssetTableContainerError() {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('investor.owned_shares')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Message message={t('common.error_loading_data')} />
      </CardContent>
    </Card>
  );
}

AssetTableContainer.Skeleton = AssetTableContainerSkeleton;
AssetTableContainer.Error = AssetTableContainerError;

export default AssetTableContainer;
