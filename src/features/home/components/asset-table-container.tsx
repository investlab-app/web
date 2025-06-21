import AssetTable from './asset-table';
import { dummyAssets } from '../helpers/dummy-assets'; // adjust the import path to match your project structure
import type { Asset } from '../types/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { useTranslation } from 'react-i18next';

const AssetTableContainer = () => {
  const { t } = useTranslation();
  const handleAssetPressed = (asset: Asset) => {
    console.log('Asset clicked:', asset);
  };

  return (
    <Card className="text-xl font-semibold">
      <CardHeader>
        <CardTitle>{t('investor.owned_shares')}</CardTitle>
      </CardHeader>
      <CardContent>
        <AssetTable data={dummyAssets} onAssetPressed={handleAssetPressed} />
      </CardContent>
    </Card>
  );
};

export default AssetTableContainer;
