import { useTranslation } from 'react-i18next';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import { PredicateNodeUI } from './predicate-node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface HasRisenFallenNodeUIProps {
  direction?: 'risen' | 'fell';
  value?: number;
  period?: number;
  unit?: 'hour' | 'day' | 'week' | 'month';
  onDirectionChange?: (value: 'risen' | 'fell') => void;
  onValueChange?: (value: number | undefined) => void;
  onPeriodChange?: (value: number | undefined) => void;
  onUnitChange?: (value: 'hour' | 'day' | 'week' | 'month') => void;
}

export function HasRisenFallenNodeUI({
  direction,
  value,
  period,
  unit,
  onDirectionChange,
  onValueChange,
  onPeriodChange,
  onUnitChange,
  nodeId,
  preview,
}: HasRisenFallenNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <PredicateNodeUI
      nodeId={nodeId}
      preview={preview}
      onValueChange={onValueChange}
      value={value}
    >
      {!preview && (
        <div>
          {t('flows.nodes.value')} {t('flows.nodes.has')}
        </div>
      )}

      {onDirectionChange ? (
        <select
          className="px-2 py-1 mx-2 border rounded"
          value={direction}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onDirectionChange(e.target.value as 'risen' | 'fell')
          }
        >
          <option value="risen">{t('flows.nodes.risen')}</option>
          <option value="fell">{t('flows.nodes.fell')}</option>
        </select>
      ) : (
        <div>
          {t('flows.nodes.has')} {t('flows.placeholders.risen_fallen')}{' '}
          {t('flows.nodes.by')}
        </div>
      )}

      {!preview && <div>{t('flows.nodes.over_duration')}</div>}

      {onPeriodChange && (
        <NumberInput
          className="w-20 mx-2"
          min={1}
          max={unit ? getMaxValue(unit) : 99}
          defaultValue={1}
          stepper={1}
          value={period}
          onValueChange={(val) => {
            const maxValue = unit ? getMaxValue(unit) : 99;
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
          className="px-2 py-1 border rounded"
          value={unit}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onUnitChange(e.target.value as 'hour' | 'day' | 'week' | 'month')
          }
        >
          <option value="hour">{t('flows.nodes.hour')}</option>
          <option value="day">{t('flows.nodes.day')}</option>
          <option value="week">{t('flows.nodes.week')}</option>
          <option value="month">{t('flows.nodes.month')}</option>
        </select>
      )}
      {!preview && <div className="ml-2">{t('flows.nodes.by')}</div>}
    </PredicateNodeUI>
  );
}
