import AssetTable from './asset-table';
import { dummyAssets } from '../helpers/dummy-assets'; // adjust the import path to match your project structure
import type { Asset } from '../types/types';

const AssetTableContainer = () => {
  const handleAssetPressed = (asset: Asset) => {
    console.log('Asset clicked:', asset);
  };

  return (
    <div className="p-4">
      <AssetTable data={dummyAssets} onAssetPressed={handleAssetPressed} />
    </div>
  );
};

export default AssetTableContainer;
