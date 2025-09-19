import { type } from 'arktype';
import { httpRequest } from '@/features/shared/queries/http-request';

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
  return httpRequest({
    endpoint: `/api/investors/me/owned-shares/`,
    validator: ownedShares,
  });
}
