import { useNodeData } from '../../hooks/use-node-data';
import { NumberNodeSettings } from './number-node-settings';
import { PriceChangeNodeUI } from './price-change-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { TimeUnit } from '../../types/node-enums';
import type { CustomNodeTypes } from '../../types/node-types';

export class PriceChangeNodeSettings extends NumberNodeSettings {
  ticker: string;
  period: number;
  unit: TimeUnit;

  constructor() {
    super();
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

  getUpdatedTicker(ticker: string): PriceChangeNodeSettings {
    this.ticker = ticker;
    return this;
  }

  getUpdatedPeriod(period: number): PriceChangeNodeSettings {
    this.period = period;
    return this;
  }

  getUpdatedUnit(unit: TimeUnit): PriceChangeNodeSettings {
    this.unit = unit;
    return this;
  }
}

export type PriceChangeNode = Node<
  {
    settings: PriceChangeNodeSettings;
  },
  CustomNodeTypes.PriceChange
>;

export const PriceChangeNode = (props: NodeProps<PriceChangeNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <PriceChangeNodeUI
      nodeId={props.id}
      ticker={props.data.settings.ticker}
      period={props.data.settings.period}
      unit={props.data.settings.unit}
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
