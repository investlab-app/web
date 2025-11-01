import { useEffect, useState } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import type { Instrument } from '../types/instrument';
import type { SortingState } from '@tanstack/react-table';
import { livePrice } from '@/features/charts/types/live-price';
import { useDebounce } from '@/features/shared/hooks/use-debounce';
import { useWS } from '@/features/shared/hooks/use-ws';
import { instrumentsWithPricesListInfiniteOptions } from '@/client/@tanstack/react-query.gen';

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
    data = undefined,
    hasNextPage,
    fetchNextPage,
    isPending,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...instrumentsWithPricesListInfiniteOptions({
      query: {
        search: debouncedSearch,
        page_size: pageSize,
        ordering: getOrdering(ordering),
      },
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const lastPageNumber =
        typeof lastPageParam === 'number'
          ? lastPageParam
          : (lastPageParam.query?.page ?? 1);
      return lastPage.next ? lastPageNumber + 1 : undefined;
    },
    placeholderData: keepPreviousData,
    meta: {
      persist: false,
    },
  });

  const instruments = (data?.pages ?? [])
    .flatMap((page) => page.results)
    .reduce(
      (acc, instrument) => {
        const priceInfo = instrument.price_info;
        const dailySummary = priceInfo.daily_summary;

        acc[instrument.ticker] = {
          id: instrument.id,
          name: instrument.name,
          volume: Number(dailySummary.volume),
          currentPrice: Number(priceInfo.current_price),
          dayChange: Number(priceInfo.todays_change),
          symbol: instrument.ticker,
          logo: instrument.logo ?? null,
          icon: instrument.icon ?? null,
          is_watched: instrument.is_watched ?? false,
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

    const out = livePrice.safeParse(lastJsonMessage);

    if (!out.success) return;

    const parsed = out.data;

    const tickersData = parsed.prices.filter((item) =>
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
