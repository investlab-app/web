import { Skeleton } from '@/features/shared/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';

export const AccountValueChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-6 w-40 bg-muted rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-md animate-pulse mt-2" />
      </CardHeader>
      <CardContent className="h-96">
        <Skeleton className="w-full h-full" />
      </CardContent>
    </Card>
  );
};
