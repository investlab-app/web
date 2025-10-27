import { useTranslation } from 'react-i18next';
import { TriggerNodeUI } from './trigger-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { useNodeData } from '@/features/flows/hooks/use-node-data';
import { NumberInput } from '@/features/shared/components/ui/number-input';

export type CheckEveryNode = Node<
  {
    interval: number;
    unit: 'hour' | 'day' | 'week';
  },
  CustomNodeTypes.CheckEvery
>;

export const CheckEveryNode = (props: NodeProps<CheckEveryNode>) => {
  const { updateNodeData } = useNodeData<CheckEveryNode['data']>(props.id);

  return (
    <CheckEveryNodeUI
      interval={props.data.interval}
      unit={props.data.unit}
      onIntervalChange={(val) => {
        updateNodeData({ interval: val! });
      }}
      onUnitChange={(val) => {
        const updates: Partial<CheckEveryNode['data']> = { unit: val };
        // Adjust interval if it exceeds the max for the new unit
        if (val === 'hour' && props.data.interval > 24) {
          updates.interval = 24;
        } else if (val === 'day' && props.data.interval > 7) {
          updates.interval = 7;
        } else if (val === 'week' && props.data.interval > 10) {
          updates.interval = 10;
        }
        updateNodeData(updates);
      }}
      nodeId={props.id}
    />
  );
};

interface CheckEveryNodeUIProps {
  interval: number;
  unit: 'hour' | 'day' | 'week';
  onIntervalChange?: (value: number | undefined) => void;
  onUnitChange?: (value: 'hour' | 'day' | 'week') => void;
}

export function CheckEveryNodeUI({
  interval,
  unit,
  onIntervalChange,
  onUnitChange,
  nodeId,
  preview,
}: CheckEveryNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  // Determine max value based on unit
  const getMaxValue = () => {
    switch (unit) {
      case 'hour':
        return 24;
      case 'day':
        return 7;
      case 'week':
        return 10;
      default:
        return 24;
    }
  };

  return (
    <TriggerNodeUI nodeId={nodeId} preview={preview}>
      {!preview ? (
        <div>{t('flows.nodes.check_every')}</div>
      ) : (
        <div>{t('flows.placeholders.check_periodically')}</div>
      )}

      {onIntervalChange && (
        <NumberInput
          className="w-20 mx-2"
          min={1}
          max={getMaxValue()}
          defaultValue={1}
          stepper={1}
          value={interval}
          onValueChange={(val) => {
            const maxValue = getMaxValue();
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
        </select>
      )}
    </TriggerNodeUI>
  );
}
