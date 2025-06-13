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

      // Use environment variable or fallback to relative path
      const apiBaseUrl = import.meta.env.VITE_API_URL || '';
      const apiUrl = `${apiBaseUrl}/api/sse?${params.toString()}`;

      try {
        await fetchEventSource(apiUrl, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onopen(response) {
            if (
              response.ok &&
              response.headers
                .get('content-type')
                ?.startsWith(EventStreamContentType)
            ) {
              return Promise.resolve();
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
            console.log('SSE connection closed. Connection may be retried.');
            // Don't throw an error that can crash the component tree
          },
          onerror(err) {
            console.error('SSE error occurred:', err);
            if (err instanceof FatalError) {
              console.error('Fatal SSE error, will not retry:', err.message);
              // Instead of throwing, we could show a user notification
              setMessages((prev) => [
                ...prev,
                `Connection error: ${err.message || 'Fatal error occurred'}`,
              ]);
            } else {
              // For non-fatal errors, log but don't crash the component
              setMessages((prev) => [
                ...prev,
                'Connection interrupted, retrying...',
              ]);
            }
          },
        });
      } catch (error) {
        console.error('Failed to establish SSE connection:', error);
        if (!isCancelled) {
          setMessages((prev) => [...prev, 'Failed to connect to server']);
        }
      }
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
