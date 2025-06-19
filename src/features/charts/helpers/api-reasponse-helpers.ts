import type { InstrumentPriceProps } from './charts-props';

export type ApiItem = {
  min_price: number;
  max_price: number;
  data: {
    timestamp: string;
    open: string;
    close: string;
    high: string;
    low: string;
  };
};

export function transformApiResponse(
  apiData: ApiItem
): Array<InstrumentPriceProps> {
  if (!Array.isArray(apiData.data)) return [];
  return apiData.data.map((item) => ({
    date: item.timestamp,
    open: parseFloat(item.open),
    close: parseFloat(item.close),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
  }));
}
