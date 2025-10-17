import { useTranslation } from 'react-i18next';

import { useQueries } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import {
  investorsMeCurrentAccountValueRetrieveOptions,
  investorsMeStatisticsProfileOverviewRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';
import { ScrollableHorizontally } from '@/features/shared/components/scrollable-horizontally';

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

  const [profileOverviewResult, currentAccountValueResult] = useQueries({
    queries: [
      investorsMeStatisticsProfileOverviewRetrieveOptions(),
      investorsMeCurrentAccountValueRetrieveOptions(),
    ],
  });

  const isError =
    profileOverviewResult.isError || currentAccountValueResult.isError;
  const isPending =
    profileOverviewResult.isPending || currentAccountValueResult.isPending;
  const isSuccess =
    profileOverviewResult.isSuccess && currentAccountValueResult.isSuccess;


  return (
    <>
      <h2 className="text-2xl font-semibold mt-6 mb-4">
        {t('statistics.profile_overview_title')}
      </h2>
      <ScrollableHorizontally>
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
              <TableHead className="text-right">
                {t('statistics.gain')}
              </TableHead>
              <TableHead className="text-right">
                {t('statistics.gain')}
                {' %'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && <ProfileOverviewBodySkeleton />}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  <span className="text-muted-foreground">
                    {t('common.error_loading_data')}
                  </span>
                </TableCell>
              </TableRow>
            )}
            {isSuccess && (
              <TableRow>
                <TableCell>{profileOverviewResult.data.level}</TableCell>
                <TableCell className="text-right">{profileOverviewResult.data.exp_points}</TableCell>
                <TableCell className="text-right">
                  {profileOverviewResult.data.left_to_next_level}
                </TableCell>
                <TableCell className="text-right">
                  {currentAccountValueResult.data.total_account_value.toFixed(2)}
                </TableCell>
                <TableCell
                  // className={cn(
                  //   'text-right',
                  //   profileOverviewResult.data.gain < 0
                  //     ? 'text-red-500'
                  //     : profileOverviewResult.data.gain > 0
                  //       ? 'text-green-500'
                  //       : ''
                  // )}
                >
                  Not implemented
                  {/* {profileOverviewResult.data.gain.toFixed(2)} {t('common.currency')} */}
                </TableCell>
                <TableCell
                  // className={cn(
                  //   'text-right',
                  //   profileOverviewResult.data.gain_percent < 0
                  //     ? 'text-red-500'
                  //     : profileOverviewResult.data.gain_percent > 0
                  //       ? 'text-green-500'
                  //       : ''
                  // )}
                >
                  {/* {data.gain_percent.toFixed(2)} */}
                  Not implemented
                  {'%'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollableHorizontally>
    </>
  );
};

export default ProfileOverview;
