export type InstrumentPriceProps = {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
};

export type ApiItem = {
  min_price: number;
  max_price: number;
  data: {
    timestamp: string;
    open: string;
    close: string;
    high: string;
    low: string;
  };
};

export type StockChartProps = {
  stockName: string;
  currentPrice: number;
  timeRanges: Array<{ label: string; value: string }>;
  selectedInterval: string;
  onIntervalChange: (value: string) => void;
  data: Array<InstrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
};

export type ChartPresentationsProps = {
  stockName: string;
  chartData: Array<InstrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
  selectedInterval: string;
};
