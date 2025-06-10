// sse-event-manager.ts
type Listener = (price: number) => void;

const listeners: Record<string, Set<Listener>> = {};
let eventSource: EventSource | null = null;

let mockInterval: NodeJS.Timeout | null = null;

function initEventSource() {
  if (eventSource) return;

  const useMock = true; // Toggle this for development

  if (useMock) {
    startMockSSE();
    return;
  }

  // Replace with your SSE endpoint
  eventSource = new EventSource('/api/stream');

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const { ticker, price } = data;

      if (listeners[ticker]) {
        listeners[ticker].forEach((callback) => callback(price));
      }
    } catch (err) {
      console.error('Failed to parse SSE message:', err);
    }
  };

  eventSource.onerror = (err) => {
    console.error('SSE error:', err);
    // Optionally reconnect logic here
  };
}

export function subscribeToTicker(ticker: string, callback: Listener) {
  if (!listeners[ticker]) {
    listeners[ticker] = new Set();
  }
  listeners[ticker].add(callback);
  initEventSource(); // Ensure it's started
}

export function unsubscribeFromTicker(ticker: string, callback: Listener) {
  if (listeners[ticker]) {
    listeners[ticker].delete(callback);
    if (listeners[ticker].size === 0) {
      delete listeners[ticker];
    }
  }

  // Optionally close EventSource if no subscribers left
  if (Object.keys(listeners).length === 0 && eventSource) {
    eventSource.close();
    eventSource = null;
  }
}

function startMockSSE() {
  if (mockInterval) return;

  const tickers = ['AAPL', 'TSCO', 'TSLA', 'NFLX'];

  mockInterval = setInterval(() => {
    const ticker = tickers[Math.floor(Math.random() * tickers.length)];
    const price = +(100 + Math.random() * 100).toFixed(2);

    if (listeners[ticker]) {
      listeners[ticker].forEach((cb) => cb(price));
    }
  }, 2000);
}
