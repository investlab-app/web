import { Skeleton } from '@/features/shared/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';

export const AssetTableSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-6 w-28 bg-muted rounded-md animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};
