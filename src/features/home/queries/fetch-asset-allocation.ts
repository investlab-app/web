import { type } from 'arktype';
import { fetchWithAuth } from '@/features/shared/queries/fetch-with-url';

const assetAllocationItem = type({
  asset_class_display_name: 'string',
  value: 'number',
  percentage: 'number',
});

const assetAllocation = type({
  total_value: 'number',
  total_return_this_year: 'number',
  allocations: assetAllocationItem.array(),
});

export type AssetAllocation = typeof assetAllocation.infer;

export const fetchAssetAllocation = async (
  token: string
): Promise<AssetAllocation> => {
  const response = await fetchWithAuth(
    `/api/investors/me/asset-allocation`,
    token
  );

  const result = assetAllocation(response);
  if (result instanceof type.errors) {
    console.error('Invalid asset allocation response:', result.summary);
    throw new Error(`Invalid asset allocation response: ${result.summary}`);
  }

  return result;
};
