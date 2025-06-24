import { type } from 'arktype';
import { fetchWithAuth } from '@/features/shared/queries/fetch-with-url';

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

export const fetchOwnedShares = async (token: string): Promise<OwnedShares> => {
  const response = await fetchWithAuth<OwnedShares>(
    `/api/investors/me/owned-shares`,
    token
  );

  const result = ownedShares(response);
  if (result instanceof type.errors) {
    console.error('Invalid owned shares response:', result.summary);
    throw new Error(`Invalid owned shares response: ${result.summary}`);
  }

  return result;
};
