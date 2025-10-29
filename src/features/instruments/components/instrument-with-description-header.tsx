import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { InstrumentIconCircle } from './instrument-image-circle';
import { PriceAlertButton } from '@/features/instrument-details/components/price-alert-button';
import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import { instrumentsDetailRetrieveOptions } from '@/client/@tanstack/react-query.gen';

interface InstrumentWithDescriptionHeaderProps {
  ticker: string;
}

export function InstrumentHeader({
  ticker: instrumentId,
}: InstrumentWithDescriptionHeaderProps) {
  const { data: instrumentInfo } = useSuspenseQuery(
    instrumentsDetailRetrieveOptions({
      query: {
        ticker: instrumentId,
      },
    })
  );

  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

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
            <PriceAlertButton ticker={instrumentId} />
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
          <div
            className={`relative w-[50%] ${
              !isExpanded ? 'max-h-14 overflow-hidden' : ''
            }`}
          >
            <p className="text-sm text-muted-foreground">
              {instrumentInfo.description}
            </p>
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-background pointer-events-none" />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-fit h-auto p-0 text-primary hover:text-primary hover:bg-transparent"
          >
            {isExpanded ? t('common.show_less') : t('common.show_more')}
          </Button>
        </div>
      )}
    </div>
  );
}
