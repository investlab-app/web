import { StatTile } from '@/features/shared/components/stat-tile';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/components/ui/table';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import AppFrame from '@/features/shared/components/app-frame';

const StatsOverviewRibbonSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <StatTile.Skeleton key={`stats-skeleton-${index}`} />
      ))}
    </div>
  );
};

const MostTradedOverviewSkeleton = () => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-6 w-48 bg-muted rounded-md animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Trades</TableHead>
                <TableHead className="text-right">Buys/Sells</TableHead>
                <TableHead className="text-right">Avg Gain</TableHead>
                <TableHead className="text-right">Avg Loss</TableHead>
                <TableHead className="text-right">Total Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RenderSkeletonRows()}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatisticsPending = () => {
  return (
    <AppFrame>
      <div className="space-y-4">
        <StatsOverviewRibbonSkeleton />
        <MostTradedOverviewSkeleton />
      </div>
    </AppFrame>
  );
};