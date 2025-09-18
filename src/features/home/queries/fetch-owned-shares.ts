import { type } from 'arktype';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

const ownedShareItem = type({
  name: 'string',
  symbol: 'string',
  volume: 'number',
  value: 'number',
  profit: 'number',
  profit_percentage: 'number',
});

const ownedShares = type({
  owned_shares: ownedShareItem.array(),
});

export type OwnedShares = typeof ownedShares.infer;

export function fetchOwnedShares() {
  return validatedFetch(`/api/investors/me/owned-shares/`, ownedShares);
}
