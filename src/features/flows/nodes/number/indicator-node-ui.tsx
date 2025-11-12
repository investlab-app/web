import { useTranslation } from 'react-i18next';

import { EnumSelect } from '../../components/enum-select';
import {
  INDICATOR_TYPE_OPTIONS,
  TIME_UNIT_OPTIONS,
} from '../../constants/node-options';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import { NumberNodeUI } from './number-node-ui';
import type { IndicatorType, TimeUnit } from '../../types/input-options-types';
import type { CustomNodeProps } from '../../types/node-props';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface IndicatorNodeUIProps {
  indicator?: IndicatorType;
  ticker?: string;
  period?: number;
  unit?: TimeUnit;
  onIndicatorChange?: (value: IndicatorType) => void;
  onTickerChange?: (value: string | undefined) => void;
  onPeriodChange?: (value: number | undefined) => void;
  onUnitChange?: (value: TimeUnit) => void;
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
        <EnumSelect
          value={indicator}
          onChange={onIndicatorChange}
          options={INDICATOR_TYPE_OPTIONS}
          className="px-2 py-1 border rounded"
        />
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
          onChange={(e) => onTickerChange(e.target.value)}
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
        <EnumSelect
          value={unit}
          onChange={onUnitChange}
          options={TIME_UNIT_OPTIONS}
          className="px-2 py-1 ml-2 border rounded"
        />
      )}
    </NumberNodeUI>
  );
}
