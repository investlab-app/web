import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';


// Custom error classes for different error types
class RetriableError extends Error {}
class FatalError extends Error {}

// Type definitions for better type safety
interface SSEMessage {
  event?: string;
  data: string;
  id?: string;
}

interface SubscriptionCallback {
  (data: string, event?: string): void;
}

interface TickerSubscription {
  callbacks: Set<SubscriptionCallback>;
}

interface SSEManagerConfig {
  baseUrl: string;
  getAuthToken: () => Promise<string | null>;
  onConnectionStateChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
}

class SSEManager {
  private static instance: SSEManager | null = null;

  // Core connection management
  private controller: AbortController | null = null;
  private connectionId: string | null = null;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;

  // Subscription management
  private subscriptions: Map<string, TickerSubscription> = new Map();

  // Configuration
  private config: SSEManagerConfig;

  // Private constructor to enforce singleton pattern
  private constructor(config: SSEManagerConfig) {
    this.config = config;
  }

  // Singleton instance getter
  public static getInstance(config?: SSEManagerConfig): SSEManager {
    if (!SSEManager.instance) {
      if (!config) {
        throw new Error(
          'SSEManager must be initialized with config on first use'
        );
      }
      SSEManager.instance = new SSEManager(config);
    }
    return SSEManager.instance;
  }

  // Subscribe to a ticker with a callback
  public async subscribe(
    ticker: string,
    callback: SubscriptionCallback,
    token: string | null
  ): Promise<() =>  void> {
    console.log(`Subscribing to ticker: ${ticker}`);

    // Initialize subscription if it doesn't exist
    if (!this.subscriptions.has(ticker)) {
      this.subscriptions.set(ticker, { callbacks: new Set() });
    }

    // Add callback to subscription
    const subscription = this.subscriptions.get(ticker)!;
    subscription.callbacks.add(callback);

    // Start connection if this is the first subscription
    if (
      this.subscriptions.size === 1 &&
      !this.isConnected &&
      !this.isConnecting
    ) {
      console.log('first');
      await this.connect(token);
    } else if (this.isConnected) {
      // If already connected, update server subscription
      console.log('later');
      this.updateServerSubscription();
    } else {
      console.log('connecion lost');
    }
    
    // Return unsubscribe function
    return () => this.unsubscribe(ticker, callback);
  }

  // Unsubscribe from a ticker
  public unsubscribe(ticker: string, callback: SubscriptionCallback): void {
    console.log(`Unsubscribing super  ool from ticker: ${ticker}`);

    const subscription = this.subscriptions.get(ticker);
    if (!subscription) return;

    // Remove callback
    subscription.callbacks.delete(callback);

    // Remove subscription if no callbacks left
    if (subscription.callbacks.size === 0) {
    this.subscriptions.delete(ticker);
    console.log(`Removed all subscriptions for ticker: ${ticker}`);
    }

    // Close connection if no subscriptions left
    if (this.subscriptions.size === 0) {
      // this.disconnect();
    } else if (this.isConnected) {
      // Update server subscription if still connected
      this.updateServerSubscription();
    }
  }

  // Get all currently subscribed tickers
  public getSubscribedTickers(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  // Check if connected
  public isConnectionActive(): boolean {
    return this.isConnected;
  }

  // Get subscription count for a ticker
  public getSubscriptionCount(ticker: string): number {
    return this.subscriptions.get(ticker)?.callbacks.size || 0;
  }

  // Private method to establish SSE connection
  private async connect(token: string | null): Promise<void> {
    if (this.isConnecting || this.isConnected) {
      console.log('Already connecting or connected');
      return;
    }

    console.log('connecting for the first time');
    this.isConnecting = true;
    this.controller = new AbortController();
    console.log('controlele cool', this.controller);
    this.connectionId = crypto.randomUUID();

    try {
      console.log('tests');
      if (!token) {
        throw new Error('No authentication token available');
      }
      console.log('raz dwa trzy');

      const params = new URLSearchParams();
      params.append('symbols', this.getSubscribedTickers().join(','));
      params.append('connectionId', this.connectionId);

      console.log('Establishing SSE connection...');
      console.log(this.controller);

      await fetchEventSource(`${this.config.baseUrl}?${params.toString()}`, {
        signal: this.controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        async onopen(response) {
          if (
            response.ok &&
            response.headers.get('content-type') === EventStreamContentType
          ) {
            console.log("SUPERCOOL");
            return;
          } else if (
            response.status >= 400 &&
            response.status < 500 &&
            response.status !== 429
          ) {
            throw new FatalError(
              `HTTP ${response.status}: ${response.statusText}`
            );
          } else {
            throw new RetriableError(
              `HTTP ${response.status}: ${response.statusText}`
            );
          }
        },
        onmessage: (msg: SSEMessage) => {
          this.handleMessage(msg);
        },
        onclose: () => {
          console.log('SSE connection closed');
          this.handleDisconnection();
          throw new RetriableError('Connection closed by server');
        },
        onerror: (err) => {
          console.error('SSE connection error:', err);
          this.handleDisconnection();
          if (err instanceof FatalError) {
            this.config.onError?.(err);
            throw err;
          }
        },
      });
      this.isConnected = true;
      console.log("connected all is good");
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
      this.handleDisconnection();
      this.config.onError?.(error as Error);
    } finally {
      this.isConnecting = false;
    }
  }

  // Private method to handle incoming messages
  private handleMessage(msg: SSEMessage): void {
    if (msg.event === 'FatalError') {
      const error = new FatalError(msg.data);
      this.config.onError?.(error);
      this.disconnect();
      return;
    }

    console.log('Received SSE message:', msg.data);

    // Mark as connected on first successful message
    if (!this.isConnected) {
      this.isConnected = true;
      this.config.onConnectionStateChange?.(true);
      console.log('SSE connection established');
    }

    // Parse message data to extract ticker information
    // Assuming the message format includes ticker information
    try {
      const messageData = JSON.parse(msg.data);
      const ticker = messageData.symbol || messageData.ticker || messageData.id;

      if (ticker && this.subscriptions.has(ticker)) {
        // Notify all callbacks for this ticker
        const subscription = this.subscriptions.get(ticker)!;
        subscription.callbacks.forEach((callback) => {
          try {
            callback(msg.data, msg.event);
          } catch (error) {
            console.error('Error in subscription callback:', error);
          }
        });
      } else {
        // If no specific ticker, notify all subscriptions
        this.subscriptions.forEach((subscription) => {
          subscription.callbacks.forEach((callback) => {
            try {
              callback(msg.data, msg.event);
            } catch (error) {
              console.error('Error in subscription callback:', error);
            }
          });
        });
      }
    } catch (parseError) {
      // If parsing fails, send to all subscriptions
      this.subscriptions.forEach((subscription) => {
        subscription.callbacks.forEach((callback) => {
          try {
            callback(msg.data, msg.event);
          } catch (error) {
            console.error('Error in subscription callback:', error);
          }
        });
      });
    }
  }

  // Private method to handle disconnection
  private handleDisconnection(): void {
    if (this.isConnected) {
      this.isConnected = false;
      this.config.onConnectionStateChange?.(false);
      console.log('SSE connection lost');
    }
    this.isConnecting = false;
  }

  // Private method to update server-side subscriptions
  private async updateServerSubscription(): Promise<void> {
    if (!this.connectionId || !this.isConnected) return;

    try {
      const token = await this.config.getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const tickers = this.getSubscribedTickers();
      console.log('Updating server subscription with tickers:', tickers);

      const response = await fetch(`${this.config.baseUrl}/subscribe`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbols: tickers,
          connectionId: this.connectionId,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update subscription: ${response.statusText}`
        );
      }

      console.log('Successfully updated server subscription');
    } catch (error) {
      console.error('Error updating server subscription:', error);
      this.config.onError?.(error as Error);
    }
  }

  // Private method to disconnect
  private disconnect(): void {
    console.log('Disconnecting SSE connection');

    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }

    this.handleDisconnection();
    this.connectionId = null;
  }

  // Public method to force disconnect (useful for cleanup)
  public forceDisconnect(): void {
    this.subscriptions.clear();
    this.disconnect();
  }

  // Public method to get connection statistics
  public getStats() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      subscribedTickers: this.getSubscribedTickers(),
      totalSubscriptions: Array.from(this.subscriptions.values()).reduce(
        (total, sub) => total + sub.callbacks.size,
        0
      ),
      connectionId: this.connectionId,
    };
  }
}

export default SSEManager;
