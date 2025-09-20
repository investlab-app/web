import { type } from 'arktype';

const insight = type({
  sentiment:
    "'positive' | 'negative' | 'neutral' | 'neutral/positive' | 'neutral/negative'",
  sentiment_reasoning: 'string',
  ticker: 'string',
});

const publisher = type({
  favicon_url: 'string',
  homepage_url: 'string',
  logo_url: 'string',
  name: 'string',
});

const article = type({
  amp_url: 'string | null',
  article_url: 'string',
  author: 'string',
  description: 'string',
  id: 'string',
  image_url: 'string | null',
  insights: insight.array().or('null'),
  keywords: 'string[] | null',
  published_utc: 'string',
  publisher: publisher,
  tickers: 'string[]',
  title: 'string',
});

export const news = article.array();
