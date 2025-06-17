type FetchHistoryForInstrumentOptions = {
  ticker: string;
  startDate: Date;
  endDate: Date;
  interval: string;
  token: string;
};

function formatDate(date: Date): string {
  return date.toISOString().split('.')[0];
}

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export function fetchHistoryForInstrument({
  ticker,
  startDate,
  endDate,
  interval,
  token,
}: FetchHistoryForInstrumentOptions) {
  if (!baseUrl || !token) {
    throw new Error('API URL or Token not defined');
  }

  const params = new URLSearchParams({
    ticker,
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    interval,
  });

  return fetch(`${baseUrl}/api/prices?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  });
}

type FetchInstrumentsOverviewOptions = {
  tickers?: string[];
  page: number;
  pageSize: number;
  sector?: string;
  sortBy?: string;
  sortDirection?: string;
  token: string;
};

import { type } from 'arktype';

type FetchAvailableInstrumentsOptions = {
  token: string;
};

const AvailableInstrumentsResponse = type({
  instruments: 'string[]'
});

export function fetchInstrumentsOverview({
  tickers = [],
  page,
  pageSize,
  sector = '',
  sortBy = '',
  sortDirection = 'asc',
  token,
}: FetchInstrumentsOverviewOptions) {
  if (!baseUrl || !token) {
    throw new Error('API URL or Token not defined');
  }

  const params = new URLSearchParams({
    tickers: tickers.map(String).join(','),
    page: page.toString(),
    page_size: pageSize.toString(),
    ...(sector && { sector }),
    ...(sortBy && { sort_by: sortBy }),
    ...(sortDirection && { sort_direction: sortDirection }),
  });

  console.log(params.toString());
  return fetch(`${baseUrl}/api/instruments?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  });
}



export async function fetchAvailableInstruments({
  token,
}: FetchAvailableInstrumentsOptions): Promise<string[]> {
  if (!baseUrl) {
    throw new Error('API URL not defined');
  }
  if (!token) {
    throw new Error('Token not defined');
  }
  
  console.log('fetching api available');
  const response = await fetch(`${baseUrl}/api/instruments/available`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  
  if (!response.ok) {
    throw new Error(await response.text());
  }
  
  const result = await response.json();

  const out = AvailableInstrumentsResponse(result);

  if (out instanceof type.errors) {
    console.error(out.summary)
    throw new Error(out.summary)
  } 

  return out.instruments;
}
