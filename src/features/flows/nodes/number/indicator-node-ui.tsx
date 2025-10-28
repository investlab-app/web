import { useTranslation } from 'react-i18next';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import { NumberNodeUI } from './number-node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface IndicatorNodeUIProps {
  indicator?: 'rolling_avg' | 'other';
  ticker?: string;
  period?: number;
  unit?: 'hour' | 'day' | 'week';
  onIndicatorChange?: (value: 'rolling_avg' | 'other') => void;
  onTickerChange?: (value: string | undefined) => void;
  onPeriodChange?: (value: number | undefined) => void;
  onUnitChange?: (value: 'hour' | 'day' | 'week') => void;
}

export function IndicatorNodeUI({
  indicator,
  ticker,
  period,
  unit,
  onIndicatorChange,
  onTickerChange,
  onPeriodChange,
  onUnitChange,
  nodeId,
  preview,
}: IndicatorNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <NumberNodeUI nodeId={nodeId} preview={preview}>
      {onIndicatorChange ? (
        <select
          className="px-2 py-1 border rounded"
          value={indicator}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onIndicatorChange(e.target.value as 'rolling_avg' | 'other')
          }
        >
          <option value="rolling_avg">{t('flows.nodes.rolling_avg')}</option>
          <option value="other">{t('flows.nodes.other')}</option>
        </select>
      ) : (
        t('flows.nodes.indicator')
      )}
      {!preview && <div className="mx-2">{t('flows.nodes.of')}</div>}

      {onTickerChange && (
        <input
          className="px-2 py-1 border rounded"
          type="text"
          placeholder="AAPL"
          value={ticker}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onTickerChange(e.target.value)
          }
        />
      )}
      {!preview ? (
        <div className="mx-2">{t('flows.nodes.over_duration')}</div>
      ) : (
        <div className="ml-1">
          {t('flows.nodes.over_duration')} {t('flows.placeholders.time')}
        </div>
      )}

      {onPeriodChange && (
        <NumberInput
          className="w-22"
          min={1}
          max={getMaxValue(unit!)}
          defaultValue={1}
          stepper={1}
          value={period}
          onValueChange={(val) => {
            const maxValue = getMaxValue(unit!);
            if (val && val > maxValue) {
              onPeriodChange(maxValue);
            } else {
              onPeriodChange(val);
            }
          }}
          decimalScale={0}
        />
      )}

      {onUnitChange && (
        <select
          className="px-2 py-1 ml-2 border rounded"
          value={unit}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onUnitChange(e.target.value as 'hour' | 'day' | 'week')
          }
        >
          <option value="hour">{t('flows.nodes.hour')}</option>
          <option value="day">{t('flows.nodes.day')}</option>
          <option value="week">{t('flows.nodes.week')}</option>
        </select>
      )}
    </NumberNodeUI>
  );
}
