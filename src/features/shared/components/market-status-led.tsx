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
  const { t } = useTranslation();
  const { data: marketStatus, isPending } = useQuery(
    marketsStatusRetrieveOptions()
  );

  // Market is considered open only during regular trading hours (not pre/after market)
  const isMarketOpen = Boolean(
    marketStatus?.market === 'open' &&
      !marketStatus.after_hours &&
      !marketStatus.early_hours
  );

  // Helper: Format date to user's local time string and timezone
  const getLocalTimeInfo = (date: Date) => {
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return { timeStr, timeZone };
  };

  // Helper: Convert Eastern Time hours to user's local time
  // Used to show market open/close times in user's timezone
  const convertETToLocal = (etHour: number, etMinute: number = 0) => {
    const etDate = new Date();
    etDate.setHours(etHour, etMinute, 0, 0);

    const localDate = new Date(
      etDate.toLocaleString('en-US', {
        timeZone: 'America/New_York',
      })
    );

    return localDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getMarketStatusInfo = () => {
    if (!marketStatus) {
      return {
        status: t('common.loading', 'Loading'),
        details: '',
      };
    }

    const serverTime = new Date(marketStatus.server_time || Date.now());
    const { timeStr, timeZone } = getLocalTimeInfo(serverTime);

    // Market hours in Eastern Time (converted to user's local timezone)
    const marketOpenET = convertETToLocal(9, 30); // 9:30 AM ET
    const marketCloseET = convertETToLocal(16, 0); // 4:00 PM ET
    const afterHoursCloseET = convertETToLocal(20, 0); // 8:00 PM ET
    const isWeekend = serverTime.getDay() === 0 || serverTime.getDay() === 6;

    // Market is open - check which session (regular, pre-market, after-hours)
    if (marketStatus.market === 'open') {
      if (marketStatus.after_hours) {
        return {
          status: t('common.after_hours', 'After Hours'),
          details: t('marketStatus.after_hours_info', {
            closeTime: marketCloseET,
            afterHoursClose: afterHoursCloseET,
            localTime: timeStr,
            timeZone,
          }),
        };
      }

      if (marketStatus.early_hours) {
        return {
          status: t('common.pre_market', 'Pre-Market'),
          details: t('marketStatus.pre_market_info', {
            openTime: marketOpenET,
            localTime: timeStr,
            timeZone,
          }),
        };
      }

      return {
        status: t('common.market_open', 'Market Open'),
        details: t('marketStatus.regular_hours_info', {
          openTime: marketOpenET,
          closeTime: marketCloseET,
          localTime: timeStr,
          timeZone,
        }),
      };
    }

    if (isWeekend) {
      return {
        status: t('common.market_closed', 'Market Closed'),
        details: t('marketStatus.weekend_closed', {
          openTime: marketOpenET,
          localTime: timeStr,
          timeZone,
        }),
      };
    }

    // Check if market opens later today (before 1:30 PM UTC = 9:30 AM ET)
    const hours = serverTime.getHours();
    if (hours < 13) {
      const hoursUntilOpen = 13 - hours;
      return {
        status: t('common.market_closed', 'Market Closed'),
        details: t('marketStatus.opens_in', {
          openTime: marketOpenET,
          hours: hoursUntilOpen,
          hourLabel:
            hoursUntilOpen === 1 ? t('common.hour') : t('common.hours'),
          localTime: timeStr,
          timeZone,
        }),
      };
    }

    // Market already closed for the day (after 8:00 PM UTC = 4:00 PM ET)
    if (hours >= 20) {
      return {
        status: t('common.market_closed', 'Market Closed'),
        details: t('marketStatus.opens_tomorrow', {
          openTime: marketOpenET,
          localTime: timeStr,
          timeZone,
        }),
      };
    }

    // Default closed message (fallback case)
    return {
      status: t('common.market_closed', 'Market Closed'),
      details: t('marketStatus.market_closed_default', {
        localTime: timeStr,
        timeZone,
      }),
    };
  };

  // Return hook state and computed values
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
