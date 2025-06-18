import { useTranslation } from 'react-i18next';
import { AssetAllocationTile } from './asset-allocation-tile';

const AssetAllocationContainer: React.FC = () => {
  const { t } = useTranslation();
  const sampleAssets: Array<[string, number]> = [
    ['tocks', 23635.23],
    ['y', 486223],
    ['Stocks', 236235.23],
    ['Unallocated', 486235.23],
  ];

  return (
    <div className="p-4">
      <AssetAllocationTile
        totalValue={235223}
        yearlyGain={32253.53}
        currency={t('common.currency')}
        assets={sampleAssets}
      />
    </div>
  );
};

export default AssetAllocationContainer;
