import { useNodeData } from '../../hooks/use-node-data';
import { PredicateNodeSettings } from './predicate-node-settings';
import { StaysTheSameNodeUI } from './stays-the-same-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class StaysTheSameNodeSettings extends PredicateNodeSettings {
  period: number;
  unit: 'hour' | 'day' | 'week' | 'month';

  constructor() {
    super();
    this.period = 1;
    this.unit = 'day';
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      Object.keys(inConnections).length == 1 &&
      'in' in outConnections &&
      this.inX != undefined &&
      this.inX > 0
    );
  }

  getUpdatedPeriod(period: number): StaysTheSameNodeSettings {
    this.period = period;
    return this;
  }

  getUpdatedUnit(
    unit: 'hour' | 'day' | 'week' | 'month'
  ): StaysTheSameNodeSettings {
    this.unit = unit;
    return this;
  }
}

export type StaysTheSameNode = Node<
  {
    settings: StaysTheSameNodeSettings;
  },
  CustomNodeTypes.StaysTheSame
>;

export const StaysTheSameNode = (props: NodeProps<StaysTheSameNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <StaysTheSameNodeUI
      nodeId={props.id}
      value={props.data.settings.inX}
      period={props.data.settings.period}
      unit={props.data.settings.unit}
      onValueChange={(val: number | undefined) => {
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
