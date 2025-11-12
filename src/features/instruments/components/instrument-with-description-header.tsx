import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { useSetWatchedTicker } from '../hooks/use-toggle-watched-instrument';
import { InstrumentIconCircle } from './instrument-image-circle';
import { PriceAlertButton } from '@/features/instrument-details/components/price-alert-button';
import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { ErrorMessage } from '@/features/shared/components/error-message';
import {
  instrumentsDetailRetrieveOptions,
  investorsMeWatchedTickersListOptions,
} from '@/client/@tanstack/react-query.gen';

interface InstrumentWithDescriptionHeaderProps {
  ticker: string;
}

export function InstrumentHeader({
  ticker: instrumentId,
}: InstrumentWithDescriptionHeaderProps) {
  const {
    data: instrumentInfo,
    isPending,
    isError,
    error,
  } = useQuery(
    instrumentsDetailRetrieveOptions({
      query: {
        ticker: instrumentId,
      },
    })
  );

  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: setWatchedTicker } = useSetWatchedTicker();

  const { data: watchedTickers = [] } = useQuery(
    investorsMeWatchedTickersListOptions()
  );

  const isWatched = watchedTickers.some(
    (ticker) => ticker.ticker === instrumentId
  );

  if (isPending) {
    return <InstrumentHeaderSkeleton />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={t('common.error_loading_instrument', {
          defaultValue: `Failed to load instrument: ${error.message || 'Unknown error'}`,
        })}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-shrink-0">
          <InstrumentIconCircle
            symbol={instrumentId}
            name={instrumentInfo.name || instrumentId}
            icon={instrumentInfo.icon ?? null}
            size="lg"
          />
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex gap-2 flex-col items-start sm:gap-4 sm:flex-row">
            <h1 className="text-2xl font-bold ">
              {instrumentInfo.name || instrumentId}
            </h1>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setWatchedTicker({
                    instrument_id: instrumentInfo.id,
                    is_watched: !isWatched,
                  });
                }}
                className={isWatched ? 'bg-accent' : ''}
              >
                <Star className={`size-4 ${isWatched ? 'fill-current' : ''}`} />
                {isWatched ? t('common.watched') : t('common.watch')}
              </Button>
              <PriceAlertButton ticker={instrumentId} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row flex-wrap gap-2 items-center">
              {instrumentInfo.primary_exchange && (
                <Badge variant="secondary">
                  <span className="text-muted-foreground">
                    {t('instruments.exchange')}:
                  </span>
                  <span className="font-bold">
                    {instrumentInfo.primary_exchange}
                  </span>
                </Badge>
              )}
              {instrumentInfo.market_cap && instrumentInfo.currency_name && (
                <Badge variant="secondary">
                  <span className="text-muted-foreground">
                    {t('instruments.market_capital')}:
                  </span>
                  <span className="font-bold">
                    {instrumentInfo.market_cap.toUpperCase()}{' '}
                    {instrumentInfo.currency_name.toUpperCase()}
                  </span>
                </Badge>
              )}
              {instrumentInfo.cik && (
                <Badge variant="secondary">
                  <span className="text-muted-foreground">
                    {t('instruments.cik')}:
                  </span>
                  <span className="font-bold">{instrumentInfo.cik}</span>
                </Badge>
              )}
              {instrumentInfo.homepage_url && (
                <Badge variant="secondary">
                  <span className="text-muted-foreground">
                    {t('instruments.website')}:
                  </span>
                  <Link
                    href={instrumentInfo.homepage_url}
                    to={instrumentInfo.homepage_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:text-primary"
                  >
                    {instrumentInfo.homepage_url}
                  </Link>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      {instrumentInfo.description && (
        <div className="flex flex-col gap-2">
          <div className="relative">
            {instrumentInfo.description.length < 350 ? (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {instrumentInfo.description}
              </p>
            ) : isExpanded ? (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {instrumentInfo.description}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-foreground hover:underline font-medium cursor-pointer ml-2"
                >
                  {t('common.show_less')}
                </button>
              </p>
            ) : (
              <div className="relative">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {instrumentInfo.description}
                </p>
                <div className="absolute bottom-0 right-0 w-full h-6 flex justify-end items-center pointer-events-none">
                  <div className="w-30 h-6 bg-gradient-to-r from-transparent to-background pointer-events-none" />
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-foreground hover:underline font-medium cursor-pointer text-sm bg-background px-1 pointer-events-auto py-0.5"
                  >
                    {t('common.show_more')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InstrumentHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-shrink-0">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex gap-2 flex-col items-start sm:gap-4 sm:flex-row">
            <Skeleton className="h-8 w-40" />
            <div className="flex gap-2 items-center">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row flex-wrap gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
