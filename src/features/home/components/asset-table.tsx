import { useTranslation } from 'react-i18next';
import type { OwnedShare } from '@/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';
import { cn } from '@/features/shared/utils/styles';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

type AssetTableProps = {
  data: Array<OwnedShare>;
  onAssetPressed: (asset: OwnedShare) => void;
  className?: string;
};

const AssetTable = ({ data, onAssetPressed, className }: AssetTableProps) => {
  const { t, i18n } = useTranslation();
  return (
    <div className={cn('overflow-x-auto', className)}>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="hidden sm:table-cell">
              {t('instruments.name')}
            </TableHead>
            <TableHead>{t('instruments.symbol')}</TableHead>
            <TableHead className="text-right">
              {t('instruments.volume')}
            </TableHead>
            <TableHead className="text-right">{t('investor.value')}</TableHead>
            <TableHead className="text-right">{t('investor.gain')}</TableHead>
            <TableHead className="text-right hidden sm:table-cell">
              {t('investor.gain_percent')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((asset, idx) => (
            <TableRow
              key={idx}
              onClick={() => onAssetPressed(asset)}
              className="cursor-pointer"
            >
              <TableCell className="hidden sm:table-cell">
                {asset.name}
              </TableCell>
              <TableCell>{asset.symbol}</TableCell>
              <TableCell className="text-right">
                {toFixedLocalized(asset.volume, i18n.language, 5)}
              </TableCell>
              <TableCell className="text-right">
                {toFixedLocalized(asset.value, i18n.language, 2)}{' '}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right',
                  asset.gain < 0 ? 'text-[var(--red)]' : 'text-[var(--green)]'
                )}
              >
                {toFixedLocalized(asset.gain, i18n.language, 2)}{' '}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right hidden sm:table-cell',
                  asset.gain_percentage === null
                    ? ''
                    : asset.gain_percentage < 0
                      ? 'text-[var(--red)]'
                      : 'text-[var(--green)]'
                )}
              >
                {asset.gain_percentage
                  ? `${toFixedLocalized(asset.gain_percentage, i18n.language, 2)}%`
                  : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetTable;
