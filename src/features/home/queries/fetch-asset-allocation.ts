import { type } from 'arktype';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

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

export function fetchAssetAllocation() {
  return validatedFetch(`/api/investors/me/asset-allocation/`, assetAllocation);
}
