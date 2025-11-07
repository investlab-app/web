import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { marketsStatusRetrieveOptions } from '@/client/@tanstack/react-query.gen';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/components/ui/tooltip';

function PendingLED({ t }: { t: (key: string, fallback: string) => string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
      <span className="text-xs text-muted-foreground">
        {t('common.loading', 'Loading')}
      </span>
    </div>
  );
}

function MarketLED({
  isMarketOpen,
  status,
}: {
  isMarketOpen: boolean;
  status: string;
}) {
  return (
    <div className="flex items-center gap-2 cursor-help">
      <div
        className={`w-2 h-2 rounded-full transition-all ${
          isMarketOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}
        aria-label={isMarketOpen ? 'Market open' : 'Market closed'}
      />
      <span className="text-xs text-muted-foreground hidden sm:inline">
        {status}
      </span>
    </div>
  );
}

function useMarketStatus() {
  const { t, i18n } = useTranslation();
  const { data: marketStatus, isPending } = useQuery(
    marketsStatusRetrieveOptions()
  );

  // Market is considered open only during regular trading hours (not pre/after market)
  const isMarketOpen = Boolean(
    marketStatus?.market === 'open' &&
      !marketStatus.after_hours &&
      !marketStatus.early_hours
  );

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const convertETToLocal = (etHour: number, etMinute: number = 0) => {
    const etOffset = 5;
    const utcDate = new Date(
      Date.UTC(1970, 0, 1, etHour + etOffset, etMinute, 0)
    );

    console.log('utcDate:', utcDate);

    return utcDate.toLocaleString(i18n.language, {
      timeZone: localTimeZone,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMarketStatusInfo = () => {
    if (!marketStatus) {
      return {
        status: t('common.loading', 'Loading'),
        details: '',
      };
    }

    const localServerTime = marketStatus.server_time
      ? new Date(marketStatus.server_time).toLocaleTimeString(i18n.language, {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: localTimeZone,
        })
      : null;

    const currentET = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
    );

    // Market hours
    const marketOpenET = convertETToLocal(9, 30);
    console.log('marketOpenET:', marketOpenET);
    const marketCloseET = convertETToLocal(16, 0);
    const afterHoursCloseET = convertETToLocal(20, 0);

    const isWeekend = currentET.getDay() === 0 || currentET.getDay() === 6;

    // Market is open - check which session (regular, pre-market, after-hours)
    if (marketStatus.market === 'open') {
      if (marketStatus.after_hours) {
        return {
          status: t('common.after_hours', 'After Hours'),
          details: t('marketStatus.after_hours_info', {
            closeTime: marketCloseET,
            afterHoursClose: afterHoursCloseET,
            localTime: localServerTime,
            timeZone: localTimeZone,
          }),
        };
      }

      if (marketStatus.early_hours) {
        return {
          status: t('common.pre_market', 'Pre-Market'),
          details: t('marketStatus.pre_market_info', {
            openTime: marketOpenET,
            localTime: localServerTime,
            timeZone: localTimeZone,
          }),
        };
      }

      return {
        status: t('common.market_open', 'Market Open'),
        details: t('marketStatus.regular_hours_info', {
          openTime: marketOpenET,
          closeTime: marketCloseET,
          localTime: localServerTime,
          timeZone: localTimeZone,
        }),
      };
    }

    if (isWeekend) {
      return {
        status: t('common.market_closed', 'Market Closed'),
        details: t('marketStatus.weekend_closed', {
          openTime: marketOpenET,
          localTime: localServerTime,
          timeZone: localTimeZone,
        }),
      };
    }

    // Check if market opens later today (before 9:30 AM ET)
    const hours = currentET.getHours();
    if (hours < 10) {
      let hoursUntilOpen = 9 - hours;
      let minutesUntilOpen = 30 - currentET.getMinutes();
      if (minutesUntilOpen < 0) {
        hoursUntilOpen -= 1;
        minutesUntilOpen += 60;
      }
      return {
        status: t('common.market_closed', 'Market Closed'),
        details: t('marketStatus.opens_in', {
          openTime: marketOpenET,
          hours: hoursUntilOpen,
          hourLabel:
            hoursUntilOpen === 1 ? t('common.hour') : t('common.hours'),
          minutes: minutesUntilOpen,
          localTime: localServerTime,
          timeZone: localTimeZone,
        }),
      };
    }

    // Market already closed for the day (after 4:00 PM ET)
    if (hours >= 16) {
      return {
        status: t('common.market_closed', 'Market Closed'),
        details: t('marketStatus.opens_tomorrow', {
          openTime: marketOpenET,
          localTime: localServerTime,
          timeZone: localTimeZone,
        }),
      };
    }

    // Default closed message (fallback case)
    return {
      status: t('common.market_closed', 'Market Closed'),
      details: t('marketStatus.market_closed_default', {
        localTime: localServerTime,
        timeZone: localTimeZone,
      }),
    };
  };

  return {
    isPending,
    isMarketOpen,
    marketStatusInfo: getMarketStatusInfo(),
  };
}

export function MarketStatusLED() {
  const { t } = useTranslation();
  const { isPending, isMarketOpen, marketStatusInfo } = useMarketStatus();

  if (isPending) {
    return <PendingLED t={t} />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <MarketLED
            isMarketOpen={isMarketOpen}
            status={marketStatusInfo.status}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="whitespace-pre-line max-w-xs">
        {marketStatusInfo.details}
      </TooltipContent>
    </Tooltip>
  );
}
