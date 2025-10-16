import { useTranslation } from 'react-i18next';
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
  data: Array<OwnedShareItem>;
  onAssetPressed: (asset: OwnedShareItem) => void;
};

const AssetTable = ({ data, onAssetPressed }: AssetTableProps) => {
  const { t, i18n } = useTranslation();
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
                {toFixedLocalized(asset.volume, i18n.language, 5)}
              </TableCell>
              <TableCell className="text-right">
                {toFixedLocalized(asset.value, i18n.language, 2)}{' '}
                {t('common.currency')}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right',
                  asset.profit < 0 ? 'text-[var(--red)]' : 'text-[var(--green)]'
                )}
              >
                {toFixedLocalized(asset.profit, i18n.language, 2)}{' '}
                {t('common.currency')}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right hidden sm:table-cell',
                  asset.profit_percentage < 0
                    ? 'text-[var(--red)]'
                    : 'text-[var(--green)]'
                )}
              >
                {toFixedLocalized(asset.profit_percentage, i18n.language, 2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetTable;
