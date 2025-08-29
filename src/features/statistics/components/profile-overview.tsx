import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import { profileOverviewQueryOptions } from '../queries/fetch-profile-overview';
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

const ProfileOverviewBodySkeleton = () => {
  return (
    <TableRow key={`skeleton`}>
      <TableCell className="h-10">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="text-right h-10">
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
  );
};

const ProfileOverview = () => {
  const { t } = useTranslation();

  const { data } = useQuery(profileOverviewQueryOptions);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('statistics.level')}</TableHead>
            <TableHead className="text-right">
              {t('statistics.exp_points')}
            </TableHead>
            <TableHead className="text-right">
              {t('statistics.left_to_next_level')}
            </TableHead>
            <TableHead className="text-right">
              {t('statistics.total_account_value')}
            </TableHead>
            <TableHead className="text-right">{t('statistics.gain')}</TableHead>
            <TableHead className="text-right">
              {t('statistics.gain')}
              {' %'}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data ? (
            <ProfileOverviewBodySkeleton />
          ) : (
            <TableRow>
              <TableCell>{data.level}</TableCell>
              <TableCell className="text-right">{data.exp_points}</TableCell>
              <TableCell className="text-right">
                {data.left_to_next_level}
              </TableCell>
              <TableCell className="text-right">
                {data.total_account_value.toFixed(2)}
              </TableCell>

              <TableCell
                className={cn(
                  'text-right',
                  data.gain < 0
                    ? 'text-red-500'
                    : data.gain > 0
                      ? 'text-green-500'
                      : ''
                )}
              >
                {data.gain.toFixed(2)} {t('common.currency')}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right',
                  data.gain_percent < 0
                    ? 'text-red-500'
                    : data.gain_percent > 0
                      ? 'text-green-500'
                      : ''
                )}
              >
                {data.gain_percent.toFixed(2)}
                {'%'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfileOverview;
