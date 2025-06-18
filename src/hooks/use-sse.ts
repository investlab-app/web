import { useEffect, useState } from 'react';
import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import { useAuth } from '@clerk/clerk-react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

class RetriableError extends Error {}
class FatalError extends Error {}

async function fetchLivePrices({
  controller,
  symbols,
  token,
  onMessage,
}: {
  controller: AbortController;
  symbols: string[];
  token: string;
  onMessage: (message: string) => void;
}) {
  const connectionId = crypto.randomUUID();
  const symbolsParam = symbols.join(',');
  const url = `${baseUrl}/api/sse?symbols=${encodeURIComponent(symbolsParam)}&connectionId=${connectionId}`;

  let isCancelled = false;

  if (isCancelled || !token) {
    console.log('Skipping fetch because component unmounted or no token.');
    return;
  }

  const params = new URLSearchParams();
  params.append('symbols', 'AAPL');
  params.append('connectionId', connectionId);

  await fetchEventSource(url, {
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    async onopen(response) {
      if (
        response.ok &&
        response.headers.get('content-type') === EventStreamContentType
      ) {
        return;
      } else if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        throw new FatalError();
      } else {
        throw new RetriableError();
      }
    },
    onmessage: (msg) => {
      if (msg.event === 'FatalError') {
        throw new FatalError(msg.data);
      }
      console.log('Received SSE message:', msg.data);
      onMessage(msg.data);
    },
    onclose() {
      throw new RetriableError();
    },
    onerror(err) {
      if (err instanceof FatalError) {
        throw err;
      }
    },
  });
}

export function useSseTickers({ symbols }: { symbols: string[] }) {
  const [messages, setMessages] = useState<string[]>([]);

  const { getToken } = useAuth();

  const fetch = async (controller: AbortController) => {
    const token = await getToken();

    if (!token) {
      console.log('No auth token available');
      return;
    }

    await fetchLivePrices({
      controller,
      symbols,
      token,
      onMessage: (message) => {
        console.log(message);
        // setMessages((prev) => [...prev, message]);
      },
    });

  }

  useEffect(() => {
    const controller = new AbortController();

    fetch(controller);

    return () => {
      controller.abort();
    };
  }, [symbols]);

  return { messages };
}
