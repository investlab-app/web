import { useTranslation } from 'react-i18next';
import type { AssetAllocationItem } from '@/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/components/ui/tooltip';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import { EmptyMessage } from '@/features/shared/components/empty-message';

interface AssetAllocationProps {
  totalValue: number;
  yearlyGain: number;
  assets: Array<AssetAllocationItem>;
}

export const AssetAllocationTile = ({
  totalValue,
  yearlyGain,
  assets,
}: AssetAllocationProps) => {
  const totalAssetValue = assets.reduce((sum, { value }) => sum + value, 0);
  const { t, i18n } = useTranslation();

  const formatPercentage = (val: number) => {
    return Math.round((val / totalAssetValue) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {t('investor.asset_allocation')}
        </CardTitle>
        <div className="text-4xl font-bold tabular-nums">
          {toFixedLocalized(totalValue, i18n.language)}
        </div>

        <span className="text-gray-400 text-sm">
          {toFixedLocalized(yearlyGain, i18n.language)}
          {t('investor.this_year')}
        </span>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {assets.length === 0 ? (
          <EmptyMessage
            message={t('investor.no_asset_allocation_data')}
            cta={{
              to: '/instruments',
              label: t('instruments.browse_instruments'),
            }}
          />
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t('investor.distribution')}
            </h3>

            <div className="flex w-full gap-2 h-8 rounded-lg">
              {assets.map(
                ({ instrument_ticker, instrument_name, value }, index) => {
                  const percentage = (value / totalAssetValue) * 100;
                  return (
                    <Tooltip key={instrument_ticker}>
                      <TooltipTrigger asChild>
                        <div
                          className="rounded-md h-4 cursor-pointer"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: `color-mix(in srgb, black ${(index / assets.length) * 80}%, var(--primary))`,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {instrument_ticker} - {instrument_name}:{' '}
                        {formatPercentage(value)}%
                      </TooltipContent>
                    </Tooltip>
                  );
                }
              )}
            </div>

            <div className="space-y-4">
              {assets.map(
                ({ instrument_name, instrument_ticker, value }, index) => (
                  <div
                    key={instrument_name}
                    className="flex items-center justify-between"
                  >
                    <div
                      key={instrument_name}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="size-4 rounded-full"
                        style={{
                          backgroundColor: `color-mix(in srgb, black ${(index / assets.length) * 80}%, var(--primary))`,
                        }}
                      />
                      <div className="space-y-1">
                        <div className="font-medium">
                          {instrument_ticker}
                          <span className="text-muted-foreground font-normal">
                            {`  (${instrument_name})`}
                          </span>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {formatPercentage(value)}
                          {'% — $'}
                          {toFixedLocalized(value, i18n.language)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
