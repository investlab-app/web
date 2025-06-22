import { useTranslation } from 'react-i18next';
import type { OwnedShareItem } from '../types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';
import { cn } from '@/features/shared/utils';

type AssetTableProps = {
  data: Array<OwnedShareItem>;
  onAssetPressed: (asset: OwnedShareItem) => void;
};

const AssetTable = ({ data, onAssetPressed }: AssetTableProps) => {
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
                {asset.volume.toFixed(5)}
              </TableCell>
              <TableCell className="text-right">
                {asset.value.toFixed(2)} {t('common.currency')}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right',
                  asset.profit < 0 ? 'text-red-500' : 'text-green-500'
                )}
              >
                {asset.profit.toFixed(2)} {t('common.currency')}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right hidden sm:table-cell',
                  asset.profit_percentage < 0 ? 'text-red-500' : 'text-green-500'
                )}
              >
                {asset.profit_percentage.toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetTable;
