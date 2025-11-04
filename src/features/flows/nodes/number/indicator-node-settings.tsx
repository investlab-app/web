import { useNodeData } from '../../hooks/use-node-data';
import { IndicatorNodeUI } from './indicator-node-ui';
import { NumberNodeSettings } from './number-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { IndicatorType, TimeUnit } from '../../types/node-enums';
import type { CustomNodeTypes } from '../../types/node-types';

export class IndicatorNodeSettings extends NumberNodeSettings {
  indicator: IndicatorType;
  ticker: string;
  period: number;
  unit: TimeUnit;

  constructor() {
    super();
    this.indicator = 'rolling_avg' as IndicatorType;
    this.ticker = '';
    this.period = 1;
    this.unit = 'day' as TimeUnit;
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

  getUpdatedIndicator(indicator: IndicatorType): IndicatorNodeSettings {
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

  getUpdatedUnit(unit: TimeUnit): IndicatorNodeSettings {
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
      onIndicatorChange={(val: IndicatorType) => {
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
      onUnitChange={(val: TimeUnit) => {
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
