import { BuySellContainer } from './buy-sell-action';
import NewsSection from './news-section';
import type { Instrument } from '../types/types';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';

type InstrumentDetailsProps = {
  instrument: Instrument;
};

const InstrumentDetails = ({ instrument }: InstrumentDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <StockChartContainer ticker={instrument.symbol} />
      </div>

      <div className="space-y-4 md:space-y-0 md:col-span-1 h-full">
        <BuySellContainer currentPrice={instrument.currentPrice} />
      </div>

      <div className="space-y-4 md:space-y-0 md:col-span-1 h-full">
        <NewsSection ticker={instrument.symbol} />
      </div>
    </div>
  );
};

export default InstrumentDetails;
