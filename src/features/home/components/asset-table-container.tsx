import { useTranslation } from 'react-i18next';
import AssetTable from './asset-table';
import type { OwnedShareItem as Asset } from '../types/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { fetchOwnedShares } from '../queries/fetch-owned-shares';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

const AssetTableContainer = () => {
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const handleAssetPressed = (asset: Asset) => {
    console.log('Asset clicked:', asset);
  };

  const {
    data: ownedSharesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['owned-shares'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Unauthenticated');
      }
      return fetchOwnedShares(token);
    },
  });

  if (isError) {
    return <div>Error fetching data</div>;
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
