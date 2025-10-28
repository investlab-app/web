import { useNodeData } from '../../hooks/use-node-data';
import { IndicatorNodeUI } from './indicator-node-ui';
import { NumberNodeSettings } from './number-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class IndicatorNodeSettings extends NumberNodeSettings {
  indicator: 'rolling_avg' | 'other';
  ticker: string;
  period: number;
  unit: 'hour' | 'day' | 'week';

  constructor() {
    super();
    this.indicator = 'rolling_avg';
    this.ticker = '';
    this.period = 1;
    this.unit = 'day';
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      super.isValid(inConnections, outConnections) &&
      this.ticker.trim().length > 0 &&
      this.period > 0
    );
  }

  getUpdatedIndicator(
    indicator: 'rolling_avg' | 'other'
  ): IndicatorNodeSettings {
    this.indicator = indicator;
    return this;
  }

  getUpdatedTicker(ticker: string): IndicatorNodeSettings {
    this.ticker = ticker;
    return this;
  }

  getUpdatedPeriod(period: number): IndicatorNodeSettings {
    this.period = period;
    return this;
  }

  getUpdatedUnit(unit: 'hour' | 'day' | 'week'): IndicatorNodeSettings {
    this.unit = unit;
    return this;
  }
}

export type IndicatorNode = Node<
  {
    settings: IndicatorNodeSettings;
  },
  CustomNodeTypes.Indicator
>;

export const IndicatorNode = (props: NodeProps<IndicatorNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <IndicatorNodeUI
      nodeId={props.id}
      indicator={props.data.settings.indicator}
      ticker={props.data.settings.ticker}
      period={props.data.settings.period}
      unit={props.data.settings.unit}
      onIndicatorChange={(val: 'rolling_avg' | 'other') => {
        updateNodeData({
          settings: props.data.settings.getUpdatedIndicator(val),
        });
      }}
      onTickerChange={(val: string | undefined) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedTicker(val ?? ''),
        });
      }}
      onPeriodChange={(val: number | undefined) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedPeriod(val ?? 1),
        });
      }}
      onUnitChange={(val: 'hour' | 'day' | 'week') => {
        let newSettings = props.data.settings.getUpdatedUnit(val);
        if (val === 'hour' && props.data.settings.period > 24) {
          newSettings = newSettings.getUpdatedPeriod(24);
        } else if (val === 'day' && props.data.settings.period > 7) {
          newSettings = newSettings.getUpdatedPeriod(7);
        } else if (val === 'week' && props.data.settings.period > 10) {
          newSettings = newSettings.getUpdatedPeriod(10);
        }
        updateNodeData({ settings: newSettings });
      }}
    />
  );
};
