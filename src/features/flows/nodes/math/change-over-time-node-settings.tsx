/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNodeData } from '../../hooks/use-node-data';
import { SuperNodeTypes } from '../../types/node-types-2';
import { NodeSettings } from '../node-settings';
import { ChangeOverTimeNodeUI } from './change-over-time-node-ui';
import type { CustomNodeTypes } from '@/features/flows/types/node-types-2';
import type { Node, NodeProps } from '@xyflow/react';

export class ChangeOverTimeNodeSettings extends NodeSettings {
  period?: number;
  unit?: 'hour' | 'day' | 'week' | 'month';
  constructor() {
    super();
    this.period = 1;
    this.unit = 'day';
  }

  getUpdatedPeriod(period?: number): ChangeOverTimeNodeSettings {
    this.period = period;
    return this;
  }

  getUpdatedUnit(
    unit?: 'hour' | 'day' | 'week' | 'month'
  ): ChangeOverTimeNodeSettings {
    this.unit = unit;
    return this;
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      Object.keys(outConnections).length == 1 &&
      Object.keys(inConnections).length == 1 &&
      this.period !== undefined &&
      this.period > 0
    );
  }

  override getAllowedConnections(
    _handleType: 'source' | 'target',
    _handleId: string
  ): number {
    return 1;
  }

  override getAllowedSupertypes(_handleId: string): Array<SuperNodeTypes> {
    return [
      SuperNodeTypes.Math,
      SuperNodeTypes.Number,
      SuperNodeTypes.NumericFlow,
    ];
  }

  override getSupertype(): SuperNodeTypes {
    return SuperNodeTypes.Math;
  }
}

export type ChangeOverTime = Node<
  {
    settings: ChangeOverTimeNodeSettings;
  },
  CustomNodeTypes.ChangeOverTime
>;

export const ChangeOverTime = (props: NodeProps<ChangeOverTime>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <ChangeOverTimeNodeUI
      nodeId={props.id}
      unit={props.data.settings.unit}
      interval={props.data.settings.period}
      onUnitChange={(val) =>
        updateNodeData({ settings: props.data.settings.getUpdatedUnit(val) })
      }
      onIntervalChange={(val) =>
        updateNodeData({ settings: props.data.settings.getUpdatedPeriod(val) })
      }
    />
  );
};
