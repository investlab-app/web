import { type } from 'arktype';
import { httpRequest } from '@/features/shared/queries/http-request';

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
  return httpRequest({
    endpoint: `/api/investors/me/asset-allocation/`,
    validator: assetAllocation,
  });
}
