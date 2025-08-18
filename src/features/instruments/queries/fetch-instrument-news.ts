import { type } from 'arktype';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

type FetchInstrumentNewsOptions = {
  ticker: string;
};

const resolution = type({
  url: 'string',
  width: 'number',
  height: 'number',
  tag: 'string',
});

const thumbnail = type({
  original_url: 'string | null',
  original_width: 'number | null',
  original_height: 'number | null',
  caption: 'string | null',
  resolutions: resolution.array(),
});

const provider = type({
  display_name: 'string | null',
  url: 'string | null',
});

const newsItem = type({
  id: 'string',
  content: {
    id: 'string',
    content_type: 'string | null',
    title: 'string',
    description: 'string',
    summary: 'string',
    pub_date: 'string | null',
    display_time: 'string | null',
    is_hosted: 'boolean | null',
    bypass_modal: 'boolean | null',
    preview_url: 'string | null',
    thumbnail: thumbnail.or('null'),
    provider: provider.optional(),
    canonical_url: 'object | null',
    click_through_url: 'object | null',
    metadata: 'object | null',
    finance: 'object | null',
    storyline: 'object | null',
  },
});

const newsResponse = type(newsItem.array());

export type NewsItem = typeof newsItem.infer;
export type NewsResponse = typeof newsResponse.infer;

export async function fetchInstrumentNews({
  ticker,
}: FetchInstrumentNewsOptions) {
  return validatedFetch(`/api/instruments/${ticker}/news/`, newsResponse);
}
