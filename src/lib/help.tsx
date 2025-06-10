import React, { useState } from 'react';
import { useSSE, useSSETickers } from '@/hooks/use-sse';

// Example 1: Manual subscription management
function SSEManualExample() {
  const [tickerInput, setTickerInput] = useState('');
  const sse = useSSE({
    baseUrl: 'http://localhost:8000/api/sse',
    onError: (error) => {
      console.error('SSE Error:', error);
      // Handle error (show notification, etc.)
    },
  });

  const handleSubscribe = () => {
    if (tickerInput.trim()) {
      sse.subscribe(tickerInput.trim().toUpperCase());
      setTickerInput('');
    }
  };

  const handleUnsubscribe = (ticker: string) => {
    sse.unsubscribe(ticker);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          SSE Manual Subscription Example
        </h2>

        {/* Connection Status */}
        <div className="mb-4 p-3 rounded-lg bg-gray-100">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                sse.connectionStatus === 'connected'
                  ? 'bg-green-500'
                  : sse.connectionStatus === 'connecting'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            ></span>
            <span className="font-medium">Status: {sse.connectionStatus}</span>
          </div>
          <div className="text-sm text-gray-600">
            Total Subscriptions: {sse.stats.totalSubscriptions} | Connection ID:{' '}
            {sse.stats.connectionId || 'None'}
          </div>
        </div>

        {/* Subscribe Form */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            placeholder="Enter ticker symbol (e.g., AAPL)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
          />
          <button
            onClick={handleSubscribe}
            disabled={!tickerInput.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Subscribe
          </button>
        </div>

        {/* Active Subscriptions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Active Subscriptions:</h3>
          <div className="flex flex-wrap gap-2">
            {sse.subscribedTickers.map((ticker) => (
              <div
                key={ticker}
                className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full"
              >
                <span>{ticker}</span>
                <button
                  onClick={() => handleUnsubscribe(ticker)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {sse.subscribedTickers.length === 0 && (
            <p className="text-gray-500">No active subscriptions</p>
          )}
        </div>
      </div>

      {/* Messages Display */}
      <div className="space-y-4">
        {Object.entries(sse.messages).map(([ticker, messages]) => (
          <div key={ticker} className="border border-gray-300 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{ticker}</h3>
              <div className="flex gap-2">
                <span className="text-sm text-gray-500">
                  {messages.length} messages
                </span>
                <button
                  onClick={() => sse.clearMessages(ticker)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto bg-gray-50 p-3 rounded">
              {messages.length === 0 ? (
                <p className="text-gray-500">No messages yet...</p>
              ) : (
                messages.slice(-10).map((message, index) => (
                  <div key={index} className="mb-1 text-sm font-mono">
                    {message}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 2: Automatic subscription to predefined tickers
function SSEAutoExample() {
  const [selectedTickers, setSelectedTickers] = useState(['AAPL', 'GOOGL']);
  const availableTickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'];

  const sse = useSSETickers(selectedTickers, {
    baseUrl: 'http://localhost:8000/api/sse',
    onError: (error) => {
      console.error('SSE Error:', error);
    },
  });

  const toggleTicker = (ticker: string) => {
    setSelectedTickers((prev) =>
      prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker]
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">SSE Auto Subscription Example</h2>

      {/* Connection Status */}
      <div className="mb-4 p-3 rounded-lg bg-gray-100">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              sse.connectionStatus === 'connected'
                ? 'bg-green-500'
                : sse.connectionStatus === 'connecting'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
          ></span>
          <span className="font-medium">Status: {sse.connectionStatus}</span>
        </div>
      </div>

      {/* Ticker Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Select Tickers to Subscribe:
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableTickers.map((ticker) => (
            <button
              key={ticker}
              onClick={() => toggleTicker(ticker)}
              className={`px-3 py-1 rounded-full border ${
                selectedTickers.includes(ticker)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {ticker}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Data Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedTickers.map((ticker) => (
          <div key={ticker} className="border border-gray-300 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{ticker}</h3>
              <button
                onClick={() => sse.clearMessages(ticker)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear
              </button>
            </div>
            <div className="bg-gray-50 p-3 rounded h-32 overflow-y-auto">
              {sse.messages[ticker]?.length === 0 || !sse.messages[ticker] ? (
                <p className="text-gray-500 text-sm">Waiting for data...</p>
              ) : (
                <div className="space-y-1">
                  {sse.messages[ticker].slice(-5).map((message, index) => (
                    <div
                      key={index}
                      className="text-xs font-mono bg-white p-1 rounded"
                    >
                      {message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main component that demonstrates both approaches
export default function SSEExamples() {
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-300 mb-6">
        <div className="flex gap-4 px-6">
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'manual'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Manual Subscription
          </button>
          <button
            onClick={() => setActiveTab('auto')}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'auto'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Auto Subscription
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'manual' ? <SSEManualExample /> : <SSEAutoExample />}
    </div>
  );
}
