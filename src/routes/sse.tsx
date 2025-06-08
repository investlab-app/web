import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@clerk/clerk-react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

export default function Sse() {
  const [messages, setMessages] = useState<Array<string>>([]);
  const [error, setError] = useState<string | null>(null); // Added error state
  const { getToken } = useAuth();

  const ctrl = new AbortController();

  useEffect(() => {
    const instruments = ['AAPL', 'GOOG', 'MSFT'];
    const selectedInstrument =
      instruments[Math.floor(Math.random() * instruments.length)];
    console.log('Selected instrument:', selectedInstrument);

    const fetchData = async () => {
      const token = await getToken();
      if (!token) {
        console.error('No auth token available');
        setError('Authentication token is missing.');
        return;
      }

      const params = new URLSearchParams();
      params.append('symbols', selectedInstrument);

      await fetchEventSource(
        `http://localhost:8000/api/sse?${params.toString()}`,
        {
          signal: ctrl.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onmessage: (event) => {
            console.log('Received SSE message:', event.data);
            setMessages((prev) => [...prev, event.data]);
          },
          onerror: (err) => {
            console.error('Error in SSE connection:', err);
            setError(
              'Failed to connect to SSE. Check the console for details.'
            );
            ctrl.abort();
            return 0; // Stops the connection
          },
          onopen: async (response) => {
            if (response.ok) {
              console.log('SSE connection opened successfully');
            } else {
              console.error(
                `Failed to open SSE connection: ${response.status}`
              );
              setError(`Failed to open SSE connection: ${response.status}`);
            }
          },
        }
      );
    };

    fetchData();

    return () => {
      ctrl.abort(); // Clean up the event source connection on unmount
      console.log('Cleanup: SSE connection aborted');
    };
  }, [ctrl, getToken]);

  return (
    <div>
      <h1>Server-Sent Events Example</h1>
      <div id="sse-data">
        {error ? (
          <p style={{ color: 'red' }}>{error}</p> // Display error message
        ) : (
          messages.map((message, index) => <p key={index}>{message}</p>)
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/sse')({
  component: Sse,
});
