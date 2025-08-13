import { useTranslation } from 'react-i18next';
import { BuySellContainer } from './buy-sell-action';
import NewsSection from './news-section';
import type { Instrument } from '../types/types';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';

type InstrumentDetailsProps = {
  instrument: Instrument | undefined;
  isLoading?: boolean;
};

const InstrumentDetails = ({
  instrument,
  isLoading,
}: InstrumentDetailsProps) => {
  const { t } = useTranslation();
  if (isLoading) {
    <div className="p-4 space-y-4 overflow-y-auto">{t('common.loading')}</div>;
  }

  if (!instrument) {
    return (
      <div className="p-4 space-y-4 overflow-y-auto">
        {t('common.error_loading_data')}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <h2 className="text-xl font-semibold text-left">
        {instrument.name} - {t('instruments.overview')}
      </h2>
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
    </div>
  );
};

export default InstrumentDetails;
