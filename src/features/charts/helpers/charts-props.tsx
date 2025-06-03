export type instrumentPriceProps = {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
};

export type StockChartProps = {
  stockName: string;
  currentPrice: number;
  timeRanges: Array<{ label: string; value: string }>;
  selectedInterval: string;
  onIntervalChange: (value: string) => void;
  data: Array<instrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
};

export type ChartPresentationsProps = {
  stockName: string;
  data: Array<instrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
  selectedInterval: string;
};
