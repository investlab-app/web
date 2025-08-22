import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { cn } from '@/features/shared/utils/styles';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

interface StatTileProps {
  title: string;
  value: number;
  currency?: string;
  isProgress?: boolean;
  footerNote?: string | null;
  trendNote?: string | null;
}

export const StatTile = ({
  title,
  value,
  currency = 'USD',
  isProgress = false,
  footerNote,
  trendNote,
}: StatTileProps) => {
  const { i18n } = useTranslation();
  const isPositive = value >= 0;
  const percentage = isProgress ? Math.abs((value / 1000) * 100) : 0;

  return (
    <Card
      className={cn(
        'min-w-[280px] min-h-[196px] @container/card border shadow-lg transition-all duration-200 hover:shadow-xl',
        isProgress
          ? isPositive
            ? 'bg-[color:var(--card-positive)] text-[color:var(--card-positive-foreground)] border-[color:var(--card-positive-border)]'
            : 'bg-[color:var(--card-negative)] text-[color:var(--card-negative-foreground)] border-[color:var(--card-negative-border)]'
          : 'bg-[color:var(--color-card)] text-[color:var(--color-card-foreground)] border-[color:var(--border)]'
      )}
    >
      <CardHeader>
        <CardDescription className={cn('text-sm font-medium')}>
          {title}
        </CardDescription>

        <CardTitle
          className={cn(
            'text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'
          )}
        >
          {isProgress && isPositive ? '+' : ''}
          {isProgress && !isPositive ? '-' : ''}
          {toFixedLocalized(value, i18n.language, 2)} {currency}
        </CardTitle>

        {isProgress && (
          <div className="mt-2 flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="size-4 " />
            ) : (
              <TrendingDown className="size-4 " />
            )}
            <span className={cn('text-sm font-medium')}>
              {toFixedLocalized(percentage, i18n.language, 2)}%
            </span>
          </div>
        )}
      </CardHeader>

      {(trendNote || footerNote) && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm mt-2">
          {trendNote && isProgress && (
            <div className={cn('line-clamp-1 flex gap-2 font-medium')}>
              {trendNote}
              {isPositive ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
            </div>
          )}

          {footerNote && (
            <div className="text-[color:var(--color-muted-foreground)]">
              {footerNote}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

const StatTileSkeleton = ({ isProgress }: { isProgress?: boolean }) => {
  return (
    <Card className="min-w-[280px] @container/card border-border shadow-lg">
      <CardHeader>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-40 mt-1" />
        {isProgress && (
          <div className="mt-2 flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-5 w-16" />
          </div>
        )}
        <Skeleton className="h-4 w-32 mt-2" />
      </CardHeader>
    </Card>
  );
};

StatTile.Skeleton = StatTileSkeleton;
