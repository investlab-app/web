import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
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
import { statisticsStatisticsMostTradedListOptions } from '@/client/@tanstack/react-query.gen';
import { ErrorMessage } from '@/features/shared/components/error-message';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { EmptyMessage } from '@/features/shared/components/empty-message';

const RenderSkeletonRows = (skeletonRowCount = 5) => {
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

  const {
    data: mostTraded,
    isError,
    isPending,
  } = useQuery(statisticsStatisticsMostTradedListOptions());

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('statistics.most_traded_overview_title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <ErrorMessage message={t('common.error_loading_data')} />
        ) : mostTraded && mostTraded.length === 0 ? (
          <EmptyMessage
            message={t('statistics.no_most_traded_instruments')}
            cta={{
              to: '/instruments',
              label: t('instruments.browse_instruments'),
            }}
          />
        ) : (
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
                {isPending
                  ? RenderSkeletonRows()
                  : mostTraded.map((instrumentOverview) => (
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
                            instrumentOverview.gain == 0 ? '' : 'text-green-500'
                          )}
                        >
                          {instrumentOverview.gain.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MostTradedOverview;
