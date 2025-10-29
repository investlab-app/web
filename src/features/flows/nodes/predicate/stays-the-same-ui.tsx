import { useTranslation } from 'react-i18next';
import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { ValidatedHandle } from '../../components/validated-handle';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface StaysTheSameNodeUIProps {
  value?: number;
  period?: number;
  unit?: 'hour' | 'day' | 'week' | 'month';
  onValueChange?: (value: number | undefined) => void;
  onPeriodChange?: (value: number | undefined) => void;
  onUnitChange?: (value: 'hour' | 'day' | 'week' | 'month') => void;
}

export function StaysTheSameNodeUI({
  value,
  period,
  unit,
  onValueChange,
  onPeriodChange,
  onUnitChange,
  nodeId,
  preview,
}: StaysTheSameNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <NodeUI nodeId={nodeId} preview={preview}>
      <div className="flex flex-col">
        <div className="flex flex-row items-center">
          <div>
            {t('flows.nodes.value')} {t('flows.nodes.stays')}{' '}
            {t('flows.nodes.the_same')}
          </div>

          {!preview && (
            <div className="ml-1">{t('flows.nodes.for_duration')}</div>
          )}

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
                onUnitChange(
                  e.target.value as 'hour' | 'day' | 'week' | 'month'
                )
              }
            >
              <option value="hour">{t('flows.nodes.hour')}</option>
              <option value="day">{t('flows.nodes.day')}</option>
              <option value="week">{t('flows.nodes.week')}</option>
              <option value="month">{t('flows.nodes.month')}</option>
            </select>
          )}
          {!preview && (
            <div className="ml-2">{t('flows.nodes.with_tolerance')}</div>
          )}
        </div>
        {onValueChange && (
          <div className="flex justify-end mt-2">
            <NumberInput
              className="w-30 mt-2"
              min={-9999}
              max={9999}
              stepper={1}
              value={value}
              onValueChange={onValueChange}
              decimalScale={3}
            />
          </div>
        )}
      </div>

      <ValidatedHandle
        type="target"
        id="out"
        nodeId={nodeId}
        position={Position.Left}
      />
      <ValidatedHandle
        type="source"
        id="in"
        nodeId={nodeId}
        position={Position.Right}
      />
    </NodeUI>
  );
}
