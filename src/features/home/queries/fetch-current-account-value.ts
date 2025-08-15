import { type } from 'arktype';
import { fetchWithAuth } from '@/queries/fetch-with-url';

const currentAccountValue = type({
  value: 'number',
});
export type CurrentAccountValue = typeof currentAccountValue.infer;

export const fetchCurrentAccountValue = async (token: string) => {
  const response = await fetchWithAuth(
    `/api/investors/me/current-account-value/`,
    token
  );
  const out = currentAccountValue(response);

  if (out instanceof type.errors) {
    console.error(out);
    throw new Error('Failed to fetch current account value');
  }

  return out.value;
};
