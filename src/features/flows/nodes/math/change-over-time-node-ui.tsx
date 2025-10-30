import { Position } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { NodeUI } from '../node-ui';
import { ValidatedHandle } from '../../components/validated-handle';
import { getMaxValue } from '../../utils/get-max-value-for-interval';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface ChangeOverTimeNodeUIProps {
  interval?: number;
  unit?: 'hour' | 'day' | 'week' | 'month';
  onIntervalChange?: (value: number | undefined) => void;
  onUnitChange?: (value: 'hour' | 'day' | 'week' | 'month') => void;
}

export function ChangeOverTimeNodeUI({
  nodeId,
  preview,
  unit,
  interval,
  onUnitChange,
  onIntervalChange,
}: ChangeOverTimeNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <NodeUI
      preview={preview}
      nodeId={nodeId}
      className={`bg-[var(--background)]`}
    >
      <div>
        {t('flows.nodes.change_of_value')} {t('flows.nodes.over_duration')}{' '}
      </div>

      {preview && <div className="ml-1">{t('flows.placeholders.time')}</div>}

      {onIntervalChange && (
        <NumberInput
          className="w-22 mx-2"
          min={1}
          max={getMaxValue(unit!)}
          defaultValue={1}
          stepper={1}
          value={interval}
          onValueChange={(val) => {
            const maxValue = getMaxValue(unit!);
            if (val && val > maxValue) {
              onIntervalChange(maxValue);
            } else {
              onIntervalChange(val);
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
            onUnitChange(e.target.value as 'hour' | 'day' | 'week')
          }
        >
          <option value="hour">{t('flows.nodes.hour')}</option>
          <option value="day">{t('flows.nodes.day')}</option>
          <option value="week">{t('flows.nodes.week')}</option>
          <option value="month">{t('flows.nodes.month')}</option>
        </select>
      )}

      <ValidatedHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id="in"
      />
      <ValidatedHandle
        nodeId={nodeId}
        type="target"
        position={Position.Left}
        id="out"
      />
    </NodeUI>
  );
}
