import { type } from 'arktype';
import { queryOptions } from '@tanstack/react-query';
import { httpRequest } from '@/features/shared/queries/http-request';

export const currentAccountValue = type({
  total_account_value: 'number',
  gain: 'number',
  gain_percent: 'number',
});
export type CurrentAccountValue = typeof currentAccountValue.infer;

export function fetchCurrentAccountValue() {
  return httpRequest({
    endpoint: `/api/investors/me/current-account-value/`,
    validator: currentAccountValue,
  });
}

export const currentAccountValueQueryOptions = queryOptions({
  queryKey: ['currentAccountValue'],
  queryFn: fetchCurrentAccountValue,
  staleTime: 60 * 1000,
});
