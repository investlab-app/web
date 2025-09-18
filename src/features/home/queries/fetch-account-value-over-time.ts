import { type } from 'arktype';
import { httpRequest } from '@/features/shared/queries/http-request';

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
  return httpRequest({
    endpoint: '/api/investors/me/account-value/',
    validator: accountValueOverTime,
  });
}
