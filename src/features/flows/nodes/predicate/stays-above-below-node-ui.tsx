import { useTranslation } from 'react-i18next';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import { PredicateNodeUI } from './predicate-node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface StaysAboveBelowNodeUIProps {
  direction?: 'above' | 'below';
  threshold?: number;
  period?: number;
  unit?: 'hour' | 'day' | 'week' | 'month';
  onDirectionChange?: (value: 'above' | 'below') => void;
  onThresholdChange?: (value: number | undefined) => void;
  onPeriodChange?: (value: number | undefined) => void;
  onUnitChange?: (value: 'hour' | 'day' | 'week' | 'month') => void;
}

export function StaysAboveBelowNodeUI({
  direction,
  threshold,
  period,
  unit,
  onDirectionChange,
  onThresholdChange,
  onPeriodChange,
  onUnitChange,
  nodeId,
  preview,
}: StaysAboveBelowNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <PredicateNodeUI nodeId={nodeId} preview={preview} onValueChange={onThresholdChange} value={threshold}>
      { !preview && ( <div >{t('flows.nodes.for_duration')}</div>)}

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

     

      {!preview ?  <div className='mx-2'>{t('flows.nodes.value_stays')}</div> : <div >{t('flows.nodes.value_stays')} {t('flows.placeholders.above_below_threshold')}</div>}

      {onDirectionChange && (
        <select
          className="px-2 py-1 mx-1 border rounded"
          value={direction}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onDirectionChange(e.target.value as 'above' | 'below')
          }
        >
          <option value="above">{t('flows.nodes.over')}</option>
          <option value="below">{t('flows.nodes.under')}</option>
        </select>
      )}

      
    </PredicateNodeUI>
  );
}
