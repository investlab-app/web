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
