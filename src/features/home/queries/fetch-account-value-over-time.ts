import { type } from 'arktype';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

const accountValueData = type({
  date: 'string',
  value: 'number',
});

const accountValueOverTime = type({
  data: accountValueData.array(),
});

export type AccountValueData = typeof accountValueData.infer;
export type AccountValueOverTime = typeof accountValueOverTime.infer;

export async function fetchAccountValueOverTime() {
  return validatedFetch(
    '/api/investors/me/account-value/',
    accountValueOverTime
  );
}
