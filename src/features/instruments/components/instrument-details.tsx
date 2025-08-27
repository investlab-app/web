import NewsSection from './news-section';
import type { Instrument } from '../types/types';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';

type InstrumentDetailsProps = {
  instrument: Instrument;
};

const InstrumentDetails = ({ instrument }: InstrumentDetailsProps) => {
  return (
    <div>
      <div className="md:col-span-2">
        <StockChartContainer ticker={instrument.symbol} />
      </div>
      <div className="space-y-4 h-full">
        <NewsSection ticker={instrument.symbol} />
      </div>
    </div>
  );
};

export default InstrumentDetails;
