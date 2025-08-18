import { queryOptions } from '@tanstack/react-query';
import { instrumentHistory } from '../types/types';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';
import { formatDate } from '@/features/shared/utils/date';

interface FetchInstrumentHistoryParams {
  ticker: string;
  startDate: Date;
  endDate: Date;
  interval: string;
}

async function fetchInstrumentHistory(params: FetchInstrumentHistoryParams) {
  const queryString = new URLSearchParams({
    ticker: params.ticker,
    start_date: formatDate(params.startDate),
    end_date: formatDate(params.endDate),
    interval: params.interval,
  });
  return await validatedFetch(
    `/api/prices?${queryString.toString()}`,
    instrumentHistory
  );
}

export function instrumentHistoryQueryOptions({
  ticker,
  startDate,
  endDate,
  interval,
}: FetchInstrumentHistoryParams) {
  return queryOptions({
    queryKey: [
      'instrument-history',
      ticker,
      formatDate(startDate),
      formatDate(endDate),
      interval,
    ],
    queryFn: async () => {
      const instrumentHistoryData = await fetchInstrumentHistory({
        ticker,
        startDate,
        endDate,
        interval,
      });
      const data = instrumentHistoryData.data.map((item) => ({
        date: item.timestamp,
        open: parseFloat(item.open),
        close: parseFloat(item.close),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
      }));
      const result = {
        min_price: instrumentHistoryData.min_price,
        max_price: instrumentHistoryData.max_price,
        data,
      };
      console.log(`Instrument History Result:`, result);
      return result;
    },

    staleTime: 1000 * 60,
  });
}
