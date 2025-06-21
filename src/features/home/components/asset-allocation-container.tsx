import { useTranslation } from 'react-i18next';
import { AssetAllocationTile } from './asset-allocation-tile';

const AssetAllocationContainer = () => {
  const { t } = useTranslation();
  const sampleAssets: Array<[string, number]> = [
    ['Stocks', 23635.23],
    ['Bonds', 4823],
    ['Unallocated', 4862.23],
  ];

  return (
    <AssetAllocationTile
      totalValue={235223}
      yearlyGain={32253.53}
      currency={t('common.currency')}
      assets={sampleAssets}
    />
  );
};

export default AssetAllocationContainer;
