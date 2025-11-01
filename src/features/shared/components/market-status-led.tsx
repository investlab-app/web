import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { marketsStatusRetrieveOptions } from '@/client/@tanstack/react-query.gen';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/components/ui/tooltip';

export function MarketStatusLED() {
  const { t } = useTranslation();
  const { data: marketStatus, isLoading } = useQuery(
    marketsStatusRetrieveOptions()
  );

  // Determine if market is open based on market property
  // Market is open if it's "open" and not after hours or early hours
  const isMarketOpen =
    marketStatus?.market === 'open' &&
    !marketStatus?.after_hours &&
    !marketStatus?.early_hours;

  // Get user's local timezone info
  const getLocalTimeInfo = (utcDate: Date) => {
    const localDate = new Date(utcDate);
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Get timezone abbreviation
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return { hours, minutes, timeStr, timeZone };
  };

  // Convert ET hours to local time
  const convertETToLocal = (etHour: number, etMinute: number = 0) => {
    const now = new Date();

    // Get current ET time using formatter
    const etFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const etParts = etFormatter.formatToParts(now);
    const currentETHour = parseInt(
      etParts.find((p) => p.type === 'hour')?.value || '0',
      10
    );
    const currentETMinute = parseInt(
      etParts.find((p) => p.type === 'minute')?.value || '0',
      10
    );

    // Calculate difference between target ET time and current ET time
    const currentETInMinutes = currentETHour * 60 + currentETMinute;
    const targetETInMinutes = etHour * 60 + etMinute;
    const diffInMinutes = targetETInMinutes - currentETInMinutes;

    // Apply difference to current local time
    const localTime = new Date(now.getTime() + diffInMinutes * 60 * 1000);
    const hours = localTime.getHours();
    const minutes = localTime.getMinutes();

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Determine market status for tooltip
  const getMarketStatusInfo = () => {
    if (!marketStatus) {
      return {
        status: t('common.loading', 'Loading'),
        details: '',
      };
    }

    const serverTime = marketStatus.server_time
      ? new Date(marketStatus.server_time)
      : new Date();

    const {
      hours: utcHours,
      timeStr: utcTimeStr,
      timeZone,
    } = getLocalTimeInfo(serverTime);

    // Market hours (ET): 9:30 AM - 4:00 PM (13:30 - 20:00 UTC)
    // After hours: 4:00 PM - 8:00 PM (20:00 - 00:00 UTC)
    // Pre-market: 4:00 AM - 9:30 AM (09:00 - 13:30 UTC)

    const marketOpenET = convertETToLocal(9, 30);
    const marketCloseET = convertETToLocal(16, 0);
    const afterHoursCloseET = convertETToLocal(20, 0);

    if (marketStatus.market === 'open') {
      if (marketStatus.after_hours) {
        const details = t('marketStatus.after_hours_info', {
          closeTime: marketCloseET,
          afterHoursClose: afterHoursCloseET,
          localTime: utcTimeStr,
          timeZone,
        });
        return {
          status: t('common.after_hours', 'After Hours'),
          details,
        };
      }

      if (marketStatus.early_hours) {
        const details = t('marketStatus.pre_market_info', {
          openTime: marketOpenET,
          localTime: utcTimeStr,
          timeZone,
        });
        return {
          status: t('common.pre_market', 'Pre-Market'),
          details,
        };
      }

      const details = t('marketStatus.regular_hours_info', {
        openTime: marketOpenET,
        closeTime: marketCloseET,
        localTime: utcTimeStr,
        timeZone,
      });
      return {
        status: t('common.market_open', 'Market Open'),
        details,
      };
    }

    // Market is closed
    const dayOfWeek = serverTime.getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      const details = t('marketStatus.weekend_closed', {
        openTime: marketOpenET,
        localTime: utcTimeStr,
        timeZone,
      });
      return {
        status: t('common.market_closed', 'Market Closed'),
        details,
      };
    }

    // Weekday but market closed
    if (utcHours < 13) {
      // Before 1:30 PM UTC (9:30 AM ET)
      const hoursUntilOpen = 13 - utcHours;
      const details = t('marketStatus.opens_in', {
        openTime: marketOpenET,
        hours: hoursUntilOpen,
        hourLabel:
          hoursUntilOpen === 1 ? t('common.hour') : t('common.hours'),
        localTime: utcTimeStr,
        timeZone,
      });
      return {
        status: t('common.market_closed', 'Market Closed'),
        details,
      };
    } else if (utcHours >= 20) {
      // After 8:00 PM UTC (4:00 PM ET)
      const details = t('marketStatus.opens_tomorrow', {
        openTime: marketOpenET,
        localTime: utcTimeStr,
        timeZone,
      });
      return {
        status: t('common.market_closed', 'Market Closed'),
        details,
      };
    }

    const details = t('marketStatus.market_closed_default', {
      localTime: utcTimeStr,
      timeZone,
    });
    return {
      status: t('common.market_closed', 'Market Closed'),
      details,
    };
  };

  const { status, details } = getMarketStatusInfo();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
        <span className="text-xs text-muted-foreground">
          {t('common.loading', 'Loading')}
        </span>
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent side="bottom" className="whitespace-pre-line max-w-xs">
        {details}
      </TooltipContent>
    </Tooltip>
  );
}
