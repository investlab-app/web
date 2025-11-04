import { useTranslation } from 'react-i18next';

import { EnumSelect } from '../../components/enum-select';
import { TIME_UNIT_OPTIONS } from '../../constants/node-options';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import { NumberNodeUI } from './number-node-ui';
import type { TimeUnit } from '../../types/node-enums';
import type { CustomNodeProps } from '../../types/node-props';

import { NumberInput } from '@/features/shared/components/ui/number-input';

interface PriceChangeNodeUIProps {
  ticker?: string;
  period?: number;
  unit?: TimeUnit;
  onTickerChange?: (value: string | undefined) => void;
  onPeriodChange?: (value: number | undefined) => void;
  onUnitChange?: (value: TimeUnit) => void;
}

export function PriceChangeNodeUI({
  ticker,
  period,
  unit,
  onTickerChange,
  onPeriodChange,
  onUnitChange,
  nodeId,
  preview,
}: PriceChangeNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <NumberNodeUI nodeId={nodeId} preview={preview}>
      <div>
        {t('flows.nodes.price_change')} {t('flows.nodes.of')}
      </div>
      {onTickerChange ? (
        <input
          className="px-2 py-1 mx-2 border rounded"
          type="text"
          placeholder="AAPL"
          value={ticker}
          onChange={(e) => onTickerChange(e.target.value)}
        />
      ) : (
        <div className="mx-1">{t('flows.placeholders.instrument')}</div>
      )}

      {!preview ? (
        <div>{t('flows.nodes.over_duration')}</div>
      ) : (
        <div>
          {t('flows.nodes.over_duration')} {t('flows.placeholders.time')}
        </div>
      )}

      {onPeriodChange && (
        <NumberInput
          className="w-22 mx-2"
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
          className="px-2 py-1 border rounded"
        />
      )}
    </NumberNodeUI>
  );
}
