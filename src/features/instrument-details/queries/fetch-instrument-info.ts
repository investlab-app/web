import { queryOptions } from '@tanstack/react-query';
import { type } from 'arktype';
import { instrumentInfo } from '../types/types';

const generateInfo = (ticker: string) => {
  return {
    ticker: ticker,
    ticker_type: 'Common Stock',
    delisted: false,

    description: `This is a sample description for ${ticker}. Stock is very valuable, yada yada.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,

    icon_url: `https://fakeimg.pl/32x32/?text=${ticker.charAt(0)}`,
    logo_url: `https://fakeimg.pl/128x128/?text=${ticker}`,
    homepage_url: `https://www.${ticker.toLowerCase()}.com`,

    currency_name: 'USD',
    market: 'NASDAQ',
    market_cap: 123456789.01,

    phone_number: '(123) 456-7890',
    sector: 'Technology',
    total_employess: 15000,
  };
};

interface fetchInstrumentInfoOptions {
  ticker: string;
}

async function fetchInstrumentInfo({ ticker }: fetchInstrumentInfoOptions) {
  //   return validatedFetch(
  //     `api/instruments/${ticker}`,
  //     instrumentInfo
  //   ) - I could not get the backend to pull the instruments properly even though the endpoint exists.
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      const history = generateInfo(ticker);
      resolve(history);
    }, 3000);
  });

  const result = instrumentInfo(response);
  if (result instanceof type.errors) {
    console.error('Invalid transactions history response:', result.summary);
    throw new Error(`Invalid transactions history response: ${result.summary}`);
  }

  return result;
}

interface InstrumentInfoQueryOptions {
  ticker: string;
}

export function instrumentInfoQueryOptions({
  ticker,
}: InstrumentInfoQueryOptions) {
  return queryOptions({
    queryKey: [`instrumentInfo`, ticker],
    queryFn: () => fetchInstrumentInfo({ ticker: ticker }),
  });
}
