import { useTranslation } from 'react-i18next';
import type { Instrument } from '../types/instruments.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
            <TableHead>{t('instruments.name')}</TableHead>
            <TableHead>{t('instruments.symbol')}</TableHead>
            <TableHead>{t('instruments.current_price')}</TableHead>
            <TableHead>{t('instruments.day_change')}</TableHead>
            <TableHead>{t('instruments.volume')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((instrument, idx) => (
            <TableRow
              key={idx}
              onClick={() => onInstrumentPressed(instrument)}
              className="cursor-pointer"
            >
              <TableCell>{instrument.name}</TableCell>
              <TableCell>{instrument.symbol}</TableCell>
              <TableCell>${instrument.currentPrice.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={
                    instrument.dayChange < 0 ? 'text-red-500' : 'text-green-500'
                  }
                >
                  {instrument.dayChange < 0 ? '-' : '+'}
                  {Math.abs(instrument.dayChange).toFixed(2)}%
                </span>
              </TableCell>
              <TableCell>{instrument.volume}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstrumentTable;
