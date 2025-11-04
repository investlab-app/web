import { useNodeData } from '../../hooks/use-node-data';
import { TimeUnit, TrendDirection } from '../../types/node-enums';
import { HasRisenFallenNodeUI } from './has-risen-fallen-node-ui';
import { PredicateNodeSettings } from './predicate-node-settings';
import type { CustomNodeTypes } from '../../types/node-types-2';
import type { Node, NodeProps } from '@xyflow/react';

export class HasRisenFallenNodeSettings extends PredicateNodeSettings {
  direction: TrendDirection;
  period: number;
  unit: TimeUnit;

  constructor() {
    super();
    this.direction = TrendDirection.Risen;
    this.period = 1;
    this.unit = TimeUnit.Day;
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return super.isValid(inConnections, outConnections) && this.period > 0;
  }

  getUpdatedDirection(direction: TrendDirection): HasRisenFallenNodeSettings {
    this.direction = direction;
    return this;
  }

  getUpdatedPeriod(period: number): HasRisenFallenNodeSettings {
    this.period = period;
    return this;
  }

  getUpdatedUnit(unit: TimeUnit): HasRisenFallenNodeSettings {
    this.unit = unit;
    return this;
  }
}

export type HasRisenFallenNode = Node<
  {
    settings: HasRisenFallenNodeSettings;
  },
  CustomNodeTypes.HasRisenFallen
>;

export const HasRisenFallenNode = (props: NodeProps<HasRisenFallenNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <HasRisenFallenNodeUI
      nodeId={props.id}
      direction={props.data.settings.direction}
      value={props.data.settings.inX}
      period={props.data.settings.period}
      unit={props.data.settings.unit}
      onDirectionChange={(val: TrendDirection) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedDirection(val),
        });
      }}
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
