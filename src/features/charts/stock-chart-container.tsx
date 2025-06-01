import * as React from 'react';
import { StockChart } from './stock-chart';
import { fetchHistoryForInstrument } from '@/remote/api';
import { useAuth } from '@clerk/clerk-react';


const timeRanges = [
  { label: '1 Hour', value: '1h' },
  { label: '1 Day', value: '1d' },
  { label: '1 Week', value: '1w' },
  { label: '1 Month', value: '1m' },
  { label: '1 Year', value: '1y' },
  { label: 'Max', value: 'max' },
];


const rangeToIntervalMap: Record<string, string> = {
    '1h': '1m',
    '1d': '5m',
    '1w': '30m',
    '1m': '1h',
    '1y': '1d',
    'max': '1d',
  };
  


const rangeToStartDate = (range: string): Date => {
    const now = new Date();
    const start = new Date(now);
    switch (range) {
      case '1h':
        start.setHours(now.getHours() - 1);
        break;
      case '1d':
        start.setDate(now.getDate() - 1);
        break;
      case '1w':
        start.setDate(now.getDate() - 7);
        break;
      case '1m':
        start.setMonth(now.getMonth() - 1);
        break;
      case '1y':
        start.setFullYear(now.getFullYear() - 1);
        break;
      case 'max':
        start.setFullYear(now.getFullYear() - 10);
        break;
    }
    return start;
  };

  function transformApiResponse(apiData: any): Array<{ date: string; price: number }> {
    if (!apiData || !Array.isArray(apiData.data)) return [];
  
    return apiData.data.map((item: any) => ({
      date: item.timestamp,
      price: parseFloat(item.close),
    }));
  }

export const StockChartContainer: React.FC = () => {
    const { getToken } = useAuth();
  const [range, setRange] = React.useState('1m');
  const [data, setData] = React.useState<Array<{ date: string; price: number }>>([]);
  const [minPrice, setMinPrice] = React.useState<number>(0);
const [maxPrice, setMaxPrice] = React.useState<number>(0);
  const [currentPrice, setCurrentPrice] = React.useState<number>(0);
  const stockTicker = 'AAPL';

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('No auth token available');

        const interval = rangeToIntervalMap[range];
        const startDate = rangeToStartDate(range);
        const endDate = new Date();

        const apiData = await fetchHistoryForInstrument({
          ticker: stockTicker,
          startDate,
          endDate,
          interval,
          token,
        });

        console.log(apiData);

        const parsed = transformApiResponse(apiData);
        setData(parsed);
        if (parsed.length > 0) {
          setCurrentPrice(parsed[parsed.length - 1].price);
          setMinPrice(apiData.min_price);
setMaxPrice(apiData.max_price);
        }
      } catch (err) {
        console.error('Failed to fetch stock data:', err);
      }
    };
    loadData();
  }, [range]);

  return (
    <StockChart
      stockName="Apple Inc. (AAPL)"
      currentPrice={currentPrice}
      timeRanges={timeRanges}
      selectedRange={range}
      onRangeChange={setRange}
      data={data}

  minPrice={minPrice}
  maxPrice={maxPrice}
    />
  );
};
