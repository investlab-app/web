import { type } from 'arktype';
import { fetchWithAuth } from '@/features/shared/queries/fetch-with-url';

const accountValueData = type({
  date: 'string',
  value: 'number',
});

export type AccountValueData = typeof accountValueData.infer;
export type AccountValueOverTime = {
  data: AccountValueData[];
};

export async function fetchAccountValueOverTime(token: string): Promise<AccountValueOverTime> {
  const response = await fetchWithAuth<AccountValueOverTime>('/api/investors/me/account-value/', token);
  
  // Validate the response structure
  if (!response || typeof response !== 'object' || !Array.isArray(response.data)) {
    throw new Error('Invalid account value over time response: missing data array');
  }
  
  // Validate each data point
  const validatedData: AccountValueData[] = [];
  for (const item of response.data) {
    const dataResult = accountValueData(item);
    if (dataResult instanceof type.errors) {
      console.error('Invalid account value data point:', dataResult.summary);
      throw new Error(`Invalid account value data point: ${dataResult.summary}`);
    }
    validatedData.push(dataResult);
  }
  
  return {
    data: validatedData,
  };
} 