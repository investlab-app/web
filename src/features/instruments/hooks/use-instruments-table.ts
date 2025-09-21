import { useEffect, useState } from 'react';
import { type } from 'arktype';
import { useInfiniteQuery } from '@tanstack/react-query';
import { infiniteInstrumentsWithPricesQueryOptions } from '../queries/fetch-instruments-with-prices';
import type { Instrument } from '../types/instrument';
import type { SortingState } from '@tanstack/react-table';
import { livePrice } from '@/features/charts/types/live-price';
import { useDebounce } from '@/features/shared/hooks/use-debounce';
import { useWS } from '@/features/shared/hooks/use-ws';

type UseInstrumentsTableParams = {
  ordering?: SortingState;
  pageSize: number;
};

const API_COLUMNS: Record<string, string> = {
  name: 'name',
  symbol: 'ticker',
  currentPrice: 'price_info__current_price',
  todaysChange: 'price_info__todays_change',
  volume: 'price_info__daily_summary__volume',
};

function getOrdering(sorting: SortingState | undefined) {
  const first = sorting?.[0];
  if (!first) return undefined;
  const field = API_COLUMNS[first.id];
  return field ? (first.desc ? `-${field}` : field) : undefined;
}

export function useInstrumentsTable({
  ordering,
  pageSize,
}: UseInstrumentsTableParams) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isPending,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    infiniteInstrumentsWithPricesQueryOptions({
      search: debouncedSearch,
      pageSize,
      ordering: getOrdering(ordering),
    })
  );

  const instruments = (data?.pages ?? [])
    .flatMap((page) => page.results)
    .reduce(
      (acc, instrument) => {
        // if (!instrument.price_info) return acc;
        acc[instrument.ticker] = {
          name: instrument.name,
          volume: instrument.price?.daily_summary.volume ?? null,
          currentPrice: instrument.price?.current_price ?? null,
          dayChange: instrument.price?.todays_change ?? null,
          symbol: instrument.ticker,
          logo: instrument.logo,
          icon: instrument.icon,
        } as Instrument;
        return acc;
      },
      {} as Record<string, Instrument>
    );

  const [liveInstruments, setLiveInstruments] = useState(instruments);
  useEffect(() => setLiveInstruments(instruments), [instruments]);

  const tickers = Object.keys(instruments);
  const { lastJsonMessage } = useWS(tickers);

  useEffect(() => {
    if (!lastJsonMessage) return;

    const out = livePrice(lastJsonMessage);
    if (out instanceof type.errors) return;

    const tickersData = out.prices.filter((item) =>
      tickers.includes(item.symbol)
    );
    if (tickersData.length === 0) return;

    setLiveInstruments((prev) =>
      tickersData.reduce(
        (acc, tickerData) => {
          acc[tickerData.symbol] = {
            ...acc[tickerData.symbol],
            currentPrice: tickerData.close,
            dayChange: tickerData.close - tickerData.official_open_price,
          } as Instrument;
          return acc;
        },
        { ...prev }
      )
    );
  }, [lastJsonMessage, tickers]);

  const dataList = Object.values(liveInstruments);

  return {
    data: dataList,
    isFetching,
    isFetchingNextPage,
    isPending,
    hasNextPage,
    fetchNextPage,
    search,
    setSearch,
    pageSize,
    pagesCount: data?.pages.length || 0,
  };
}
