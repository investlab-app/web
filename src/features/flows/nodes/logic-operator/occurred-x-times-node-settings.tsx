
import { useNodeData } from '../../hooks/use-node-data';
import { LogicOperatorNodeSettings } from './logic-operator-node-settings';
import { OccurredXTimesNodeUI } from './occurred-x-times-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class OccurredXTimesNodeSettings extends LogicOperatorNodeSettings {
  times: number;
  period: number;
  interval: number;
  timeUnit: 'hour' | 'day' | 'week' | 'month';
  intervalUnit: 'hour' | 'day';

  constructor() {
    super();
    this.times = 1;
    this.period = 1;
    this.interval = 1;
    this.timeUnit = 'day';
    this.intervalUnit = 'day';
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
      this.interval > 0
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
    this.interval = interval;
    return this;
  }

  getUpdatedTimeUnit(
    timeUnit:  'hour' | 'day' | 'week' | 'month'
  ): OccurredXTimesNodeSettings {
    this.timeUnit = timeUnit;
    return this;
  }

  getUpdatedIntervalUnit(
    intervalUnit: 'hour' | 'day'
  ): OccurredXTimesNodeSettings {
    this.intervalUnit = intervalUnit;
    return this;
  }

}

export type OccurredXTimesNode = Node<
  {
    settings: OccurredXTimesNodeSettings;
  },
  CustomNodeTypes.OccurredXTimes
>;

export const OccurredXTimesNode = (props: NodeProps<OccurredXTimesNode>) => {
   const { updateNodeData } = useNodeData(props.id);
  return <OccurredXTimesNodeUI nodeId={props.id} 
  times={props.data.settings.times}
    interval={props.data.settings.interval}
    period={props.data.settings.period}
    timeUnit={props.data.settings.timeUnit}
    intervalUnit={props.data.settings.intervalUnit}
    onTimesChange={(val) => {
     updateNodeData({ settings: props.data.settings.getUpdatedTimes(val!) });
    }}
    onIntervalChange={(val) => {
      updateNodeData({ settings: props.data.settings.getUpdatedInterval(val!) });}}
    onPeriodChange={(val) => {
      updateNodeData({ settings: props.data.settings.getUpdatedPeriod(val!) });}}
    onTimeUnitChange={(val) => {
      updateNodeData({ settings: props.data.settings.getUpdatedTimeUnit(val) });}}
    onIntervalUnitChange={(val) => {
      updateNodeData({ settings: props.data.settings.getUpdatedIntervalUnit(val) });  
    }}
  />;
};
