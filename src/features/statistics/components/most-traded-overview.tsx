import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import { mostTradedOverviewQueryOptions } from '../queries/fetch-most-traded-overview';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { cn } from '@/features/shared/utils/styles';

const RenderSkeletonRows = ({ skeletonRowCount = 5 }) => {
  return Array.from({ length: skeletonRowCount }).map((_, idx) => (
    <TableRow key={`skeleton-${idx}`}>
      <TableCell className="hidden sm:table-cell h-10">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="h-10">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="text-right h-10">
        <Skeleton className="h-4 w-20 ml-auto" />
      </TableCell>
      <TableCell className="text-right h-10">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
      <TableCell className="text-right h-10">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
      <TableCell className="text-right h-10">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
    </TableRow>
  ));
};

const MostTradedOverview = () => {
  const { t } = useTranslation();

  const { data } = useQuery(mostTradedOverviewQueryOptions);

  console.log('MostTradedOverview data:', data);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('instruments.symbol')}</TableHead>
            <TableHead className="text-right">
              {t('statistics.no_trades')}
            </TableHead>
            <TableHead className="text-right">
              {t('statistics.buys_sells')}
            </TableHead>
            <TableHead className="text-right">
              {t('statistics.avg_gain')}
            </TableHead>
            <TableHead className="text-right">
              {t('statistics.avg_loss')}
            </TableHead>
            <TableHead className="text-right">
              {t('statistics.total_return')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data
            ? RenderSkeletonRows({})
            : data.instruments.map((instrumentOverview) => (
                <TableRow key={instrumentOverview.symbol}>
                  <TableCell>{instrumentOverview.symbol}</TableCell>
                  <TableCell className="text-right">
                    {instrumentOverview.no_trades}
                  </TableCell>
                  <TableCell className="text-right">
                    {`${instrumentOverview.buys}/${instrumentOverview.sells}`}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right',
                      instrumentOverview.avg_gain == 0 ? '' : 'text-green-500'
                    )}
                  >
                    {instrumentOverview.avg_gain.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right',
                      instrumentOverview.avg_loss == 0 ? '' : 'text-red-500'
                    )}
                  >
                    {instrumentOverview.avg_loss.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right',
                      instrumentOverview.total_return < 0
                        ? 'text-red-500'
                        : instrumentOverview.total_return > 0
                          ? 'text-green-500'
                          : ''
                    )}
                  >
                    {instrumentOverview.total_return.toFixed(2)}{' '}
                    {t('common.currency')}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MostTradedOverview;
