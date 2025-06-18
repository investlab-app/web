import { useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useAuth } from '@clerk/clerk-react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

async function createEventStream({
  symbols,
  token,
}: {
  symbols: string[];
  token: string;
}) {
  const connectionId = crypto.randomUUID();
  const symbolsParam = symbols.join(',');
  const url = `${baseUrl}/api/sse?symbols=${encodeURIComponent(symbolsParam)}&connectionId=${connectionId}`;

  try {
    if (!token) {
      console.error('No token');
      return;
    }

    await fetchEventSource(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      onmessage: (message) => {
        console.log(`Got message ${message}`);
      },
      onerror: (error) => {
        console.error('Error in SSE:', error);
      },
      onclose: () => {
        console.log(`Stream closed`);
      },
    });
  } catch (error) {
    console.error('Failed to connect to SSE:', error);
    throw error;
  }
}

export function useSseTickers({ symbols }: { symbols: string[] }) {
  const { getToken } = useAuth();

  const getTokenAndFetch = async () => {
    const token = await getToken();
    if (!token) {
      console.error('No token');
    }
    else if (!symbols || symbols.length === 0) {
      console.error('No symbols');
    } else {
      createEventStream({ symbols, token });
    }
  };

  useEffect(() => {
    getTokenAndFetch();
  }, [symbols, getToken]);

  return { messages: { [symbols[0]]: ["test"] } };
}
