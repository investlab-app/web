import { useNodeData } from '../../hooks/use-node-data';
import { ShortTimeUnit, TimeUnit } from '../../types/input-options-types';
import { LogicOperatorNodeSettings } from './logic-operator-node-settings';
import { OccurredXTimesNodeUI } from './occurred-x-times-node-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export class OccurredXTimesNodeSettings extends LogicOperatorNodeSettings {
  times: number;
  period: number;
  period2: number;
  unit: TimeUnit;
  unit2: ShortTimeUnit;

  constructor() {
    super();
    this.times = 1;
    this.period = 1;
    this.period2 = 1;
    this.unit = TimeUnit.Day;
    this.unit2 = ShortTimeUnit.Day;
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      Object.keys(inConnections).length == 1 &&
      Object.keys(outConnections).length == 1 &&
      this.times >= 0 &&
      this.period > 0 &&
      this.period2 > 0
    );
  }

  getUpdatedTimes(times: number): OccurredXTimesNodeSettings {
    this.times = times;
    return this;
  }

  getUpdatedPeriod(period: number): OccurredXTimesNodeSettings {
    this.period = period;
    return this;
  }

  getUpdatedInterval(interval: number): OccurredXTimesNodeSettings {
    this.period2 = interval;
    return this;
  }

  getUpdatedTimeUnit(timeUnit: TimeUnit): OccurredXTimesNodeSettings {
    this.unit = timeUnit;
    return this;
  }

  getUpdatedIntervalUnit(
    intervalUnit: ShortTimeUnit
  ): OccurredXTimesNodeSettings {
    this.unit2 = intervalUnit;
    return this;
  }
}

export type OccurredXTimesNode = Node<
  {
    settings: OccurredXTimesNodeSettings;
  },
  typeof CustomNodeTypes.OccurredXTimes
>;

export const OccurredXTimesNode = (props: NodeProps<OccurredXTimesNode>) => {
  const { updateNodeData } = useNodeData(props.id);
  return (
    <OccurredXTimesNodeUI
      nodeId={props.id}
      times={props.data.settings.times}
      interval={props.data.settings.period2}
      period={props.data.settings.period}
      timeUnit={props.data.settings.unit}
      intervalUnit={props.data.settings.unit2}
      onTimesChange={(val) => {
        updateNodeData({ settings: props.data.settings.getUpdatedTimes(val!) });
      }}
      onIntervalChange={(val) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedInterval(val!),
        });
      }}
      onPeriodChange={(val) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedPeriod(val!),
        });
      }}
      onTimeUnitChange={(val: TimeUnit) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedTimeUnit(val),
        });
      }}
      onIntervalUnitChange={(val: ShortTimeUnit) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedIntervalUnit(val),
        });
      }}
    />
  );
};
