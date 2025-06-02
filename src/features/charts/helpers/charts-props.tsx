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
  selectedRange: string;
  onRangeChange: (value: string) => void;
  data: Array<instrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
};

export type ChartPresentationsProps = {
  stockName: string;
  data: Array<instrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
  selectedRange: string;
};
