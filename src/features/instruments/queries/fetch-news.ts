import { news } from '../types/news';
import type { SortDirection } from '@tanstack/react-table';
import { httpRequest } from '@/features/shared/queries/http-request';

type FetchInstrumentNewsOptions = {
  numberOfNews?: number;
  order?: SortDirection;
  publishedUTC?: Date;
  published_utc_gte?: Date;
  published_utc_lte?: Date;
  sort?: string;
  ticker?: string;
};

async function fetchNews({
  numberOfNews,
  order,
  publishedUTC,
  published_utc_gte,
  published_utc_lte,
  sort,
  ticker,
}: FetchInstrumentNewsOptions) {
  const params = {
    number_of_news: numberOfNews?.toString(),
    order,
    published_utc: publishedUTC?.toISOString(),
    published_utc__gte: published_utc_gte?.toISOString(),
    published_utc__lte: published_utc_lte?.toISOString(),
    sort,
    ticker,
  };

  return httpRequest({
    endpoint: `/api/news`,
    searchParams: params,
    validator: news,
  });
}

export const newsQueryOptions = (props: FetchInstrumentNewsOptions) => ({
  queryKey: ['news', props],
  queryFn: () => fetchNews(props),
});
