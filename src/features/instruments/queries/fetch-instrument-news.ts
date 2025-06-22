import { type } from 'arktype';
import { fetchWithAuth } from '@/features/shared/queries/fetch-with-url';

type FetchInstrumentNewsOptions = {
  ticker: string;
  token: string;
};

const newsItem = type({
  id: 'string?',
  content: {
    id: 'string?',
    content_type: 'string?',
    title: 'string?',
    description: 'string?',
    summary: 'string?',
    pub_date: 'string?',
    display_time: 'string?',
    is_hosted: 'boolean?',
    bypass_modal: 'boolean?',
    preview_url: 'string?',
    thumbnail: {
      original_url: 'string?',
      original_width: 'number?',
      original_height: 'number?',
      caption: 'string?',
      resolutions: 'object[]?',
    },
    provider: {
      display_name: 'string?',
      url: 'string?',
    },
    canonical_url: {
      url: 'string?',
      site: 'string?',
      region: 'string?',
      lang: 'string?',
    },
    click_through_url: {
      url: 'string?',
      site: 'string?',
      region: 'string?',
      lang: 'string?',
    },
    metadata: {
      editors_pick: 'boolean?',
    },
    finance: {
      premium_finance: {
        is_premium_news: 'boolean?',
        is_premium_free_news: 'boolean?',
      },
    },
    storyline: 'object?',
  },
});

const newsResponse = type(
    newsItem.array()
);

export type NewsItem = typeof newsItem.infer;
export type NewsResponse = typeof newsResponse.infer;

export async function fetchInstrumentNews({
  ticker,
  token,
}: FetchInstrumentNewsOptions): Promise<NewsResponse> {
  const response = await fetchWithAuth(`/api/instruments/${ticker}/news/`, token);

  const out = newsResponse(response);

  if (out instanceof type.errors) {
    console.error(out.summary);
    throw new Error(out.summary);
  }

  return out;
} 