import { useNodeData } from '../../hooks/use-node-data';
import { BuySellPercentNodeUI } from './buy-sell-percent-node-ui';
import { ActionNodeSettings } from './action-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class BuySellPercentNodeSettings extends ActionNodeSettings {
  action: string;
  percent: number;
  ticker: string;

  constructor() {
    super();
    this.ticker = '';
    this.percent = 25;
    this.action = 'buy';
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      super.isValid(inConnections, outConnections) &&
      this.ticker.trim().length > 0 &&
      this.percent > 0
    );
  }

  getUpdatedTicker(ticker: string): BuySellPercentNodeSettings {
    this.ticker = ticker;
    return this;
  }

  getUpdatedAction(action: string): BuySellPercentNodeSettings {
    this.action = action;
    return this;
  }

  getUpdatedPercent(percent: number): BuySellPercentNodeSettings {
    this.percent = percent;
    return this;
  }
}

export type BuySellPercentNode = Node<
  {
    settings: BuySellPercentNodeSettings;
  },
  CustomNodeTypes.BuySellPercent
>;

export const BuySellPercentNode = (props: NodeProps<BuySellPercentNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <BuySellPercentNodeUI
      nodeId={props.id}
      instrument={props.data.settings.ticker}
      percent={props.data.settings.percent}
      action={props.data.settings.action}
      onInstrumentChange={(val) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedTicker(val!),
        });
      }}
      onPercentChange={(val) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedPercent(val!),
        });
      }}
      onActionChange={(val) => {
        let newSettings = props.data.settings.getUpdatedAction(val);
        if (
          val === 'sell' &&
          props.data.settings.percent &&
          props.data.settings.percent > 100
        ) {
          newSettings = newSettings.getUpdatedPercent(100);
        }
        updateNodeData({ settings: newSettings });
      }}
    />
  );
};
