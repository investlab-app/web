import { useNodeData } from '../../hooks/use-node-data';
import { CheckEveryNodeUI } from './check-every-node';
import { TriggerNodeSettings } from './trigger-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class CheckEveryNodeSettings extends TriggerNodeSettings {
  interval: number;
  unit: 'hour' | 'day' | 'week';

  constructor() {
    super();
    this.interval = 1;
    this.unit = 'day';
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return super.isValid(inConnections, outConnections) && this.interval > 0;
  }

  getUpdatedInterval(interval: number): CheckEveryNodeSettings {
    this.interval = interval;
    return this;
  }

  getUpdatedUnit(unit: 'hour' | 'day' | 'week'): CheckEveryNodeSettings {
    this.unit = unit;
    return this;
  }
}

export type CheckEveryNode = Node<
  {
    settings: CheckEveryNodeSettings;
  },
  CustomNodeTypes.CheckEvery
>;

export const CheckEveryNode = (props: NodeProps<CheckEveryNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <CheckEveryNodeUI
      nodeId={props.id}
      interval={props.data.settings.interval}
      unit={props.data.settings.unit}
      onIntervalChange={(val) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedInterval(val!),
        });
      }}
      onUnitChange={(val) => {
        let newSettings = props.data.settings.getUpdatedUnit(val);
        // Adjust interval if it exceeds the max for the new unit
        if (val === 'hour' && props.data.settings.interval > 24) {
          newSettings = newSettings.getUpdatedInterval(24);
        } else if (val === 'day' && props.data.settings.interval > 7) {
          newSettings = newSettings.getUpdatedInterval(7);
        } else if (val === 'week' && props.data.settings.interval > 10) {
          newSettings = newSettings.getUpdatedInterval(10);
        }
        updateNodeData({ settings: newSettings });
      }}
    />
  );
};
