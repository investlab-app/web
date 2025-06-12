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

type FetchAvailableInstrumentsOptions = {
  token: string;
};

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
  return fetch(`${baseUrl}/api/instruments/instruments?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  });
}

export function fetchAvailableInstruments({
  token,
}: FetchAvailableInstrumentsOptions) {
  if (!baseUrl || !token) {
    throw new Error('API URL or Token not defined');
  }
  console.log('fetching api available');
  return fetch(`${baseUrl}/api/instruments/instruments/available`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  });
}
