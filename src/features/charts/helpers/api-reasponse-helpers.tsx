import type { instrumentPriceProps } from './charts-props';

export function transformApiResponse(
  apiData: any
): Array<instrumentPriceProps> {
  if (!apiData || !Array.isArray(apiData.data)) return [];

  return apiData.data.map((item: any) => ({
    date: item.timestamp,
    open: parseFloat(item.open),
    close: parseFloat(item.close),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
  }));
}
