import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { cn } from '@/features/shared/utils/styles';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

enum TileColoring {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
}
interface StatTileProps {
  title: string;
  value: string;
  percentage?: number | undefined;
  isProgress?: boolean;
  coloring?: TileColoring;
}

export const StatTile = ({
  title,
  value,
  percentage = undefined,
  isProgress = false,
  coloring = TileColoring.NEUTRAL,
}: StatTileProps) => {
  const { i18n } = useTranslation();

  return (
    <Card
      className={cn(
        'min-w-[200px] @container/card border border-[color:var(--color-border)] shadow-lg transition-shadow duration-200 hover:shadow-xl',
        coloring === TileColoring.NEUTRAL
          ? 'bg-[color:var(--color-card)] text-[color:var(--color-card-foreground)] border-[color:var(--border)]'
          : coloring === TileColoring.POSITIVE
            ? 'bg-[color:var(--card-positive)] text-[color:var(--card-positive-foreground)] border-[color:var(--card-positive-border)]'
            : 'bg-[color:var(--card-negative)] text-[color:var(--card-negative-foreground)] border-[color:var(--card-negative-border)]'
      )}
    >
      <CardHeader>
        <CardDescription className={cn('text-sm font-medium text-foreground/70')}>
          {title}
        </CardDescription>

        <CardTitle
          className={cn(
            'text-2xl font-semibold tabular-nums'
          )}
        >
          {value}
        </CardTitle>

        {percentage !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            {isProgress && percentage >= 0 ? (
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
    </Card>
  );
};

const StatTileSkeleton = () => {
  return (
    <Card className="@container/card border-border shadow-lg">
      <CardHeader>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-40 mt-1" />
      </CardHeader>
    </Card>
  );
};

StatTile.Skeleton = StatTileSkeleton;
StatTile.Coloring = TileColoring;
