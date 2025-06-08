import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@clerk/clerk-react';
import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';

class RetriableError extends Error {}

class FatalError extends Error {}

export default function Sse() {
  const [messages, setMessages] = useState<Array<string>>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    // Use a flag to ignore the async result if the component has unmounted
    let isCancelled = false;
    const controller = new AbortController();

    const instruments = ['AAPL', 'GOOG', 'MSFT'];
    const selectedInstrument =
      instruments[Math.floor(Math.random() * instruments.length)];

    console.log('Selected instrument:', selectedInstrument);

    const fetchData = async () => {
      const token = await getToken();

      if (isCancelled || !token) {
        console.log('Skipping fetch because component unmounted or no token.');
        return;
      }

      const params = new URLSearchParams();
      params.append('symbols', selectedInstrument);

      await fetchEventSource(
        `http://localhost:8000/api/sse?${params.toString()}`,
        {
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
            setMessages((prev) => [...prev, msg.data]);
          },
          onclose() {
            throw new RetriableError();
          },
          onerror(err) {
            if (err instanceof FatalError) {
              throw err;
            }
          },
        }
      );
    };

    fetchData();

    return () => {
      console.log('Cleaning up effect.');
      // Set the flag and abort the controller
      isCancelled = true;
      controller.abort();
    };
  }, [getToken]);

  return (
    <div>
      <h1>Server-Sent Events Example</h1>
      <div id="sse-data">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/sseDemo')({
  component: Sse,
});
