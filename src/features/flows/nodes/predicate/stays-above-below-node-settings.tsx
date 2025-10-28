import { useNodeData } from '../../hooks/use-node-data';
import { StaysAboveBelowNodeUI } from './stays-above-below-node-ui';
import { PredicateNodeSettings } from './predicate-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class StaysAboveBelowNodeSettings extends PredicateNodeSettings {
  direction: 'above' | 'below';
  period: number;
  unit: 'hour' | 'day' | 'week' | 'month';

  constructor() {
    super();
    this.direction = 'above';
    this.period = 1;
    this.unit = 'day';
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return super.isValid(inConnections, outConnections) && this.period > 0;
  }

  getUpdatedDirection(direction: 'above' | 'below'): StaysAboveBelowNodeSettings {
    this.direction = direction;
    return this;
  }

  getUpdatedPeriod(period: number): StaysAboveBelowNodeSettings {
    this.period = period;
    return this;
  }

  getUpdatedUnit(unit: 'hour' | 'day' | 'week' | 'month'): StaysAboveBelowNodeSettings {
    this.unit = unit;
    return this;
  }
}

export type StaysAboveBelowNode = Node<
  {
    settings: StaysAboveBelowNodeSettings;
  },
  CustomNodeTypes.StaysAboveBelow
>;

export const StaysAboveBelowNode = (props: NodeProps<StaysAboveBelowNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <StaysAboveBelowNodeUI
      nodeId={props.id}
      direction={props.data.settings.direction}
      threshold={props.data.settings.value}
      period={props.data.settings.period}
      unit={props.data.settings.unit}
      onDirectionChange={(val: 'above' | 'below') => {
        updateNodeData({
          settings: props.data.settings.getUpdatedDirection(val),
        });
      }}
      onThresholdChange={(val: number | undefined) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedValue(val),
        });
      }}
      onPeriodChange={(val: number | undefined) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedPeriod(val ?? 1),
        });
      }}
      onUnitChange={(val: 'hour' | 'day' | 'week' | 'month') => {
        updateNodeData({
          settings: props.data.settings.getUpdatedUnit(val),
        });
      }}
    />
  );
};
