import { useTranslation } from 'react-i18next';
import type { Instrument } from '../types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';
import { cn } from '@/features/shared/utils';

type InstrumentTableProps = {
  data: Array<Instrument>;
  onInstrumentPressed: (instrument: Instrument) => void;
};

const InstrumentTable = ({
  data,
  onInstrumentPressed,
}: InstrumentTableProps) => {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden sm:table-cell">
              {t('instruments.name')}
            </TableHead>
            <TableHead>{t('instruments.symbol')}</TableHead>
            <TableHead className="text-right">
              {t('instruments.current_price')}
            </TableHead>
            <TableHead className="text-right">
              {t('instruments.day_change')}
            </TableHead>
            <TableHead className="text-right">
              {t('instruments.volume')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((instrument, idx) => (
            <TableRow
              key={idx}
              onClick={() => onInstrumentPressed(instrument)}
              className="cursor-pointer"
            >
              <TableCell className="hidden sm:table-cell">
                {instrument.name}
              </TableCell>
              <TableCell>{instrument.symbol}</TableCell>
              <TableCell className="text-right">
                {instrument.currentPrice.toFixed(2)} {t('common.currency')}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right',
                  instrument.dayChange < 0 ? 'text-red-500' : 'text-green-500'
                )}
              >
                {instrument.dayChange < 0 ? '-' : '+'}
                {Math.abs(instrument.dayChange).toFixed(2)}%
              </TableCell>
              <TableCell className="text-right">{instrument.volume}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstrumentTable;
