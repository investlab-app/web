import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import SSEManager from '@/remote/sse-manager';

interface UseSSEOptions {
  baseUrl?: string;
  onError?: (error: Error) => void;
}

interface UseSSEReturn {
  subscribe: (ticker: string) => void;
  unsubscribe: (ticker: string) => void;
  messages: Record<string, string[]>;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  subscribedTickers: string[];
  clearMessages: (ticker?: string) => void;
  stats: ReturnType<SSEManager['getStats']>;
}

export function useSSE(options: UseSSEOptions = {}): UseSSEReturn {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Record<string, string[]>>({});
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected');
  const [subscribedTickers, setSubscribedTickers] = useState<string[]>([]);
  const [stats, setStats] = useState<ReturnType<SSEManager['getStats']>>();

  // Use refs to store callbacks to avoid recreating them on every render
  const callbacksRef = useRef<
    Map<string, (data: string, event?: string) => void>
  >(new Map());
  const sseManagerRef = useRef<SSEManager | null>(null);

  // Initialize SSE manager
  useEffect(() => {
    const config = {
      baseUrl: options.baseUrl || 'http://localhost:8000/api/sse',
      getAuthToken: getToken,
      onConnectionStateChange: (connected: boolean) => {
        setConnectionStatus(connected ? 'connected' : 'disconnected');
        updateStats();
      },
      onError: (error: Error) => {
        console.error('SSE Manager Error:', error);
        options.onError?.(error);
        setConnectionStatus('disconnected');
        updateStats();
      },
    };

    sseManagerRef.current = SSEManager.getInstance(config);
    updateStats();

    return () => {
      // Cleanup all subscriptions when hook unmounts
      if (sseManagerRef.current) {
        callbacksRef.current.forEach((callback, ticker) => {
          sseManagerRef.current!.unsubscribe(ticker, callback);
        });
        callbacksRef.current.clear();
      }
    };
  }, [getToken, options.baseUrl, options.onError]);

  // Function to update local stats
  const updateStats = useCallback(() => {
    if (sseManagerRef.current) {
      const currentStats = sseManagerRef.current.getStats();
      setStats(currentStats);
      setSubscribedTickers(currentStats.subscribedTickers);
    }
  }, []);

  // Subscribe to a ticker
  const subscribe = useCallback(
    (ticker: string) => {
      if (!sseManagerRef.current) {
        console.error('SSE Manager not initialized');
        return;
      }

      // Don't subscribe if already subscribed from this hook instance
      if (callbacksRef.current.has(ticker)) {
        console.log(`Already subscribed to ${ticker} from this component`);
        return;
      }

      console.log(`Subscribing to ${ticker}`);
      setConnectionStatus('connecting');

      // Create callback for this ticker
      const callback = (data: string, event?: string) => {
        setMessages((prev) => ({
          ...prev,
          [ticker]: [...(prev[ticker] || []), data],
        }));
      };

      // Store callback reference
      callbacksRef.current.set(ticker, callback);

      // Subscribe with SSE manager
      const unsubscribeFn = sseManagerRef.current.subscribe(ticker, callback);

      // Update local state
      updateStats();

      // Store unsubscribe function for later use
      callbacksRef.current.set(`${ticker}_unsubscribe`, unsubscribeFn as any);
    },
    [updateStats]
  );

  // Unsubscribe from a ticker
  const unsubscribe = useCallback(
    (ticker: string) => {
      if (!sseManagerRef.current) {
        console.error('SSE Manager not initialized');
        return;
      }

      const callback = callbacksRef.current.get(ticker);
      if (!callback) {
        console.log(`Not subscribed to ${ticker} from this component`);
        return;
      }

      console.log(`Unsubscribing from ${ticker}`);

      // Unsubscribe using stored callback
      sseManagerRef.current.unsubscribe(ticker, callback);

      // Clean up references
      callbacksRef.current.delete(ticker);
      callbacksRef.current.delete(`${ticker}_unsubscribe`);

      // Update local state
      updateStats();
    },
    [updateStats]
  );

  // Clear messages for a specific ticker or all tickers
  const clearMessages = useCallback((ticker?: string) => {
    if (ticker) {
      setMessages((prev) => ({
        ...prev,
        [ticker]: [],
      }));
    } else {
      setMessages({});
    }
  }, []);

  return {
    subscribe,
    unsubscribe,
    messages,
    connectionStatus,
    subscribedTickers,
    clearMessages,
    stats: stats || {
      isConnected: false,
      isConnecting: false,
      subscribedTickers: [],
      totalSubscriptions: 0,
      connectionId: null,
    },
  };
}

// Alternative hook for simpler use cases where you just want to subscribe to specific tickers
export function useSSETickers(
  tickers: string[],
  options: UseSSEOptions = {}
): Omit<UseSSEReturn, 'subscribe' | 'unsubscribe'> {
  const sse = useSSE(options);

  useEffect(() => {
    // Subscribe to all tickers
    tickers.forEach((ticker) => {
      sse.subscribe(ticker);
    });

    // Cleanup: unsubscribe from all tickers
    return () => {
      tickers.forEach((ticker) => {
        sse.unsubscribe(ticker);
      });
    };
  }, [tickers.join(',')]); // Re-run when tickers change

  return {
    messages: sse.messages,
    connectionStatus: sse.connectionStatus,
    subscribedTickers: sse.subscribedTickers,
    clearMessages: sse.clearMessages,
    stats: sse.stats,
  };
}
