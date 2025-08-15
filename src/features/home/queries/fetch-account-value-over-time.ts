import { type } from 'arktype';
import { fetchWithAuth } from '@/queries/fetch-with-url';

const accountValueData = type({
  date: 'string',
  value: 'number',
});

const accountValueOverTime = type({
  data: accountValueData.array(),
});

export type AccountValueData = typeof accountValueData.infer;
export type AccountValueOverTime = typeof accountValueOverTime.infer;

export async function fetchAccountValueOverTime(
  token: string
): Promise<AccountValueOverTime> {
  const response = await fetchWithAuth<AccountValueOverTime>(
    '/api/investors/me/account-value/',
    token
  );

  const result = accountValueOverTime(response);
  if (result instanceof type.errors) {
    console.error('Invalid account value over time response:', result.summary);
    throw new Error(
      `Invalid account value over time response: ${result.summary}`
    );
  }

  return result;
}
