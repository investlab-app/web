import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { instrumentHistory } from '../types/instrument-history';
import type { TimeInterval } from '../utils/time-ranges';
import { httpRequest } from '@/features/shared/queries/http-request';
import { roundDateToInterval } from '@/features/shared/utils/date';

interface FetchInstrumentHistoryParams {
  ticker: string;
  startDate: Date;
  endDate: Date;
  interval: TimeInterval;
  intervalMultiplier?: number;
}

function formatDate(date: Date): string {
  return date.toISOString().split('.')[0];
}

async function fetchInstrumentHistory({
  ticker,
  startDate,
  endDate,
  interval,
  intervalMultiplier,
}: FetchInstrumentHistoryParams) {
  const params = {
    ticker,
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    interval,
    interval_multiplier: intervalMultiplier?.toString(),
  };
  return httpRequest({
    endpoint: `/api/prices/ohlc`,
    searchParams: params,
    validator: instrumentHistory,
  });
}

export function instrumentHistoryQueryOptions({
  ticker,
  startDate,
  endDate,
  interval,
  intervalMultiplier,
}: FetchInstrumentHistoryParams) {
  const gcTime = 60_000; // 1 minute

  const roundDateToGCTime = (date: Date) =>
    roundDateToInterval(date, gcTime).toISOString();

  return queryOptions({
    queryKey: [
      'instrument-history',
      ticker,
      interval,
      roundDateToGCTime(startDate),
      roundDateToGCTime(endDate),
      intervalMultiplier,
    ],
    queryFn: async () => {
      const instrumentHistoryData = await fetchInstrumentHistory({
        ticker,
        startDate,
        endDate,
        interval,
        intervalMultiplier,
      });
      const data = instrumentHistoryData.map((item) => ({
        date: item.timestamp,
        open: item.open,
        close: item.close,
        high: item.high,
        low: item.low,
      }));
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime,
    placeholderData: keepPreviousData,
  });
}
