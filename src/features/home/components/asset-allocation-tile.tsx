import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AssetAllocationProps {
  totalValue: number;
  yearlyGain: number;
  currency?: string;
  assets: Array<[string, number]>;
}

export const AssetAllocationTile = ({
  totalValue,
  yearlyGain,
  currency = 'USD',
  assets,
}: AssetAllocationProps) => {
  const totalAssetValue = assets.reduce((sum, [, value]) => sum + value, 0);
  const { t } = useTranslation();

  const formatValue = (val: number) => {
    return val.toLocaleString(t('common.locale'), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentage = (val: number) => {
    return Math.round((val / totalAssetValue) * 100);
  };

  console.log(assets);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {t('investor.asset_allocation')}
        </CardTitle>
        <div className="text-4xl font-bold tabular-nums">
          {formatValue(totalValue)} {currency}
        </div>

        <span className="text-gray-400 text-sm">
          {formatValue(yearlyGain)} {currency} {t('investor.this_year')}
        </span>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t('investor.distribution')}
          </h3>

          <div className="flex w-full h-8 rounded-lg">
            {assets.map(([name, value], index) => {
              const percentage = (value / totalAssetValue) * 100;
              return (
                <div
                  key={name}
                  className="rounded-md h-4 mx-1"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: `color-mix(in srgb, black ${(index / assets.length) * 100}%, var(--primary))`,
                  }}
                />
              );
            })}
          </div>

          <div className="space-y-4">
            {assets.map(([name, value], index) => (
              <div key={name} className="flex items-center justify-between">
                <div key={name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: `color-mix(in srgb, black ${(index / assets.length) * 100}%, var(--primary))`,
                    }}
                  />
                  <div className="space-y-1">
                    <div className="font-medium">{name}</div>
                    <div className="text-gray-400 text-sm">
                      {formatPercentage(value)}%
                    </div>
                  </div>
                </div>
                <div className="font-semibold tabular-nums">
                  {formatValue(value)} {currency}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
