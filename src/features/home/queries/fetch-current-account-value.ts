import { type } from 'arktype';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

export const currentAccountValue = type({
  total_account_value: 'number',
  gain: 'number',
  gain_percent: 'number',
});
export type CurrentAccountValue = typeof currentAccountValue.infer;

export function fetchCurrentAccountValue() {
  return validatedFetch(
    `/api/investors/me/current-account-value/`,
    currentAccountValue
  );
}
