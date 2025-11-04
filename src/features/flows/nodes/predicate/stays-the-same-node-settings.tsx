import { useNodeData } from '../../hooks/use-node-data';
import { TimeUnit } from '../../types/node-enums';
import { PredicateNodeSettings } from './predicate-node-settings';
import { StaysTheSameNodeUI } from './stays-the-same-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export class StaysTheSameNodeSettings extends PredicateNodeSettings {
  period: number;
  unit: TimeUnit;

  constructor() {
    super();
    this.period = 1;
    this.unit = TimeUnit.Day;
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

  getUpdatedUnit(unit: TimeUnit): StaysTheSameNodeSettings {
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
      onUnitChange={(val: TimeUnit) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedUnit(val),
        });
      }}
    />
  );
};
