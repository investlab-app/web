import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { Instrument } from '@/features/instruments/types/instrument';
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/features/shared/components/ui/sheet';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';
import { NewsSection } from '@/features/instruments/components/news-section';
import { InstrumentIconCircle } from '@/features/instruments/components/instrument-image-circle';
import { Button } from '@/features/shared/components/ui/button';

interface InstrumentSheetHeaderProps {
  instrument: Instrument;
}

export function InstrumentSheetHeader({
  instrument,
}: InstrumentSheetHeaderProps) {
  const { t } = useTranslation();

  return (
    <SheetHeader>
      <SheetTitle>
        <div className="flex items-center gap-4">
          <InstrumentIconCircle
            symbol={instrument.symbol}
            name={instrument.name}
            icon={instrument.icon}
            size="lg"
          />
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold">{instrument.name}</span>
            <Button variant="link" className="self-start p-0 h-min" asChild>
              <Link to={`/instruments/${instrument.symbol}`}>
                {t('instruments.see_details')}
              </Link>
            </Button>
          </div>
        </div>
      </SheetTitle>
      <SheetDescription />
    </SheetHeader>
  );
}

interface InstrumentSheetContentProps {
  instrument: Instrument;
}

export function InstrumentSheetContent({
  instrument,
}: InstrumentSheetContentProps) {
  return (
    <>
      <InstrumentSheetHeader instrument={instrument} />
      <div className="flex flex-col gap-4 px-4 mb-16">
        <StockChartContainer ticker={instrument.symbol} />
        <NewsSection ticker={instrument.symbol} />
      </div>
    </>
  );
}
