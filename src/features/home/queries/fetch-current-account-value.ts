import { type } from 'arktype';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

const currentAccountValue = type({
  value: 'number',
});
export type CurrentAccountValue = typeof currentAccountValue.infer;

export function fetchCurrentAccountValue() {
  return validatedFetch(
    `/api/investors/me/current-account-value/`,
    currentAccountValue
  );
}
