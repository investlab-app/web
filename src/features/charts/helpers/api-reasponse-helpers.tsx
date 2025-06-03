import type { ApiItem, InstrumentPriceProps } from './charts-props';

export function transformApiResponse(
  apiData: ApiItem
): Array<InstrumentPriceProps> {
  if (!Array.isArray(apiData.data)) return [];
  console.log(apiData);
  return apiData.data.map((item) => ({
    date: item.timestamp,
    open: parseFloat(item.open),
    close: parseFloat(item.close),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
  }));
}
