import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import {
  Activity,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Wifi,
  WifiOff,
} from 'lucide-react';

// Chart configuration abstraction
const createCandlestickConfig = (data, title = 'Financial Data') => ({
  title: {
    text: title,
    left: 'center',
    textStyle: {
      color: '#333',
      fontSize: 18,
      fontWeight: 'bold',
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
    formatter: function (params) {
      const data = params[0].data;
      return `
        <div style="padding: 8px;">
          <div><strong>Date:</strong> ${data[0]}</div>
          <div><strong>Open:</strong> $${data[1].toFixed(2)}</div>
          <div><strong>Close:</strong> $${data[2].toFixed(2)}</div>
          <div><strong>Low:</strong> $${data[3].toFixed(2)}</div>
          <div><strong>High:</strong> $${data[4].toFixed(2)}</div>
          <div><strong>Volume:</strong> ${data[5]?.toLocaleString() || 'N/A'}</div>
        </div>
      `;
    },
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
  },
  xAxis: {
    type: 'time',
    scale: true,
    boundaryGap: false,
    axisLine: { onZero: false },
    splitLine: { show: false },
    min: 'dataMin',
    max: 'dataMax',
  },
  yAxis: {
    type: 'value',
    scale: true,
    splitArea: {
      show: true,
    },
  },
  dataZoom: [
    {
      type: 'inside',
      start: 50,
      end: 100,
    },
    {
      show: true,
      type: 'slider',
      top: '90%',
      start: 50,
      end: 100,
    },
  ],
  series: [
    {
      name: 'Candlestick',
      type: 'candlestick',
      data: data.map((item) => [item[1], item[2], item[3], item[4]]),
      itemStyle: {
        color: '#00da3c',
        color0: '#ec0000',
        borderColor: '#00da3c',
        borderColor0: '#ec0000',
      },
    },
  ],
});

const createLineConfig = (data, title = 'Price Movement') => ({
  title: {
    text: title,
    left: 'center',
    textStyle: {
      color: '#333',
      fontSize: 18,
      fontWeight: 'bold',
    },
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      const point = params[0];
      return `
        <div style="padding: 8px;">
          <div><strong>Time:</strong> ${point.name}</div>
          <div><strong>Price:</strong> $${point.value.toFixed(2)}</div>
        </div>
      `;
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: data.map((item) => item.timestamp || item[0]),
  },
  yAxis: {
    type: 'value',
    scale: true,
  },
  series: [
    {
      name: 'Price',
      type: 'line',
      data: data.map((item) => item.price || item[1]),
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: '#1890ff',
        width: 2,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
          { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
        ]),
      },
    },
  ],
});

// Custom hooks for data management
const useFinancialData = (symbol) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulated API call to stocks-backend/4
      const response = await fetch(`/api/stocks-backend/4?symbol=${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Transform API data to chart format [timestamp, open, close, low, high, volume]
      const chartData = result.data.map((item) => [
        new Date(item.timestamp).toLocaleDateString(),
        item.open,
        item.close,
        item.low,
        item.high,
        item.volume,
      ]);

      setData(chartData);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError(err.message);
      // Fallback to mock data for demo
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  return { data, loading, error, fetchInitialData, setData };
};

const useSSEConnection = (symbol, onDataReceived) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const eventSourceRef = useRef(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      setConnectionStatus('connecting');

      // Connect to stocks-backend/14 SSE endpoint
      const eventSource = new EventSource(
        `/api/stocks-backend/14?symbol=${symbol}`
      );
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('SSE connection opened');
        setConnectionStatus('connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onDataReceived(data);
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setConnectionStatus('error');

        // Reconnect after 5 seconds
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            connect();
          }
        }, 5000);
      };
    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
      setConnectionStatus('error');
    }
  }, [symbol, onDataReceived]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setConnectionStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connectionStatus, connect, disconnect };
};

// Utility function to generate mock data for demo
const generateMockData = () => {
  const data = [];
  let basePrice = 100;
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const open = basePrice + (Math.random() - 0.5) * 4;
    const close = open + (Math.random() - 0.5) * 6;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    const volume = Math.floor(Math.random() * 1000000) + 100000;

    data.push([
      date.toLocaleDateString(),
      parseFloat(open.toFixed(2)),
      parseFloat(close.toFixed(2)),
      parseFloat(low.toFixed(2)),
      parseFloat(high.toFixed(2)),
      volume,
    ]);

    basePrice = close;
  }

  return data;
};

// Main Financial Chart Component
const FinancialChart = ({
  symbol = 'AAPL',
  chartType = 'candlestick',
  title,
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const { data, loading, error, fetchInitialData, setData } =
    useFinancialData(symbol);
  const [realtimeData, setRealtimeData] = useState([]);

  // Handle real-time data updates
  const handleRealtimeData = useCallback((newData) => {
    const formattedData = {
      timestamp: new Date(newData.timestamp).toLocaleTimeString(),
      price: newData.price,
    };

    setRealtimeData((prev) => {
      const updated = [...prev, formattedData];
      // Keep only last 100 points for performance
      return updated.length > 100 ? updated.slice(-100) : updated;
    });
  }, []);

  const { connectionStatus, connect, disconnect } = useSSEConnection(
    symbol,
    handleRealtimeData
  );

  // Initialize chart
  useEffect(() => {
    if (chartRef.current && !chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);

      // Handle window resize
      const handleResize = () => {
        chartInstanceRef.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstanceRef.current?.dispose();
      };
    }
  }, []);

  // Update chart when data changes
  useEffect(() => {
    if (chartInstanceRef.current && data.length > 0) {
      const config =
        chartType === 'candlestick'
          ? createCandlestickConfig(
              data,
              title || `${symbol} - Candlestick Chart`
            )
          : createLineConfig(
              realtimeData.length > 0 ? realtimeData : data,
              title || `${symbol} - Price Chart`
            );

      chartInstanceRef.current.setOption(config, true);
    }
  }, [data, realtimeData, chartType, symbol, title]);

  // Fetch initial data on mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4" />;
      case 'connecting':
        return <Activity className="w-4 h-4 animate-pulse" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
        <div className="flex flex-col items-center space-y-4 text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Failed to Load Data
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchInitialData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = data.length > 0 ? data[data.length - 1][2] : 0;
  const previousPrice =
    data.length > 1 ? data[data.length - 2][2] : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent =
    previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;

  return (
    <div className="w-full space-y-4">
      {/* Header with controls and stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center space-x-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{symbol}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                ${currentPrice.toFixed(2)}
              </span>
              <div
                className={`flex items-center space-x-1 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {priceChange >= 0 ? '+' : ''}
                  {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div
            className={`flex items-center space-x-2 ${getConnectionStatusColor()}`}
          >
            {getConnectionIcon()}
            <span className="text-sm font-medium capitalize">
              {connectionStatus}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {connectionStatus === 'disconnected' ? (
              <button
                onClick={connect}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Connect Live
              </button>
            ) : (
              <button
                onClick={disconnect}
                className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Disconnect
              </button>
            )}

            <button
              onClick={fetchInitialData}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div ref={chartRef} className="w-full h-96"></div>
      </div>

      {/* Real-time data indicator */}
      {realtimeData.length > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              Live Data: {realtimeData.length} updates received
            </span>
            <span className="text-blue-600 text-sm">
              Last update: {realtimeData[realtimeData.length - 1]?.timestamp}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Demo component showing multiple chart configurations
const FinancialDashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [chartType, setChartType] = useState('candlestick');

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Financial Data Dashboard
        </h1>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Symbol:</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {symbols.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Chart Type:
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="candlestick">Candlestick</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
        </div>

        {/* Main Chart */}
        <FinancialChart
          key={`${selectedSymbol}-${chartType}`}
          symbol={selectedSymbol}
          chartType={chartType}
        />
      </div>
    </div>
  );
};

export default FinancialDashboard;
