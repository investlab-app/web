type FetchFromApiOptions = {
  endpoint: string;
  method?: 'GET' | 'POST';
  body?: Record<string, any>;
  token: string;
};

export async function fetchFromApi({
  endpoint,
  method = 'GET',
  body,
  token,
}: FetchFromApiOptions): Promise<any> {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  if (!baseUrl || !token) {
    throw new Error(
      'API URL or Token is not defined in environment variables.'
    );
  }

  let url = `${baseUrl}/${endpoint}`;

  if (method === 'GET' && body) {
    const query = new URLSearchParams();
    for (const key in body) {
      if (body[key] !== undefined && body[key] !== null) {
        query.append(key, String(body[key]));
      }
    }
    url += `?${query.toString()}`;
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ...(method !== 'GET' && body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

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

export async function fetchHistoryForInstrument({
  ticker,
  startDate,
  endDate,
  interval,
  token,
}: FetchHistoryForInstrumentOptions): Promise<any> {
  return fetchFromApi({
    endpoint: 'api/prices',
    body: {
      ticker,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      interval,
    },
    token: token,
  });
}
