import { useNodeData } from '../../hooks/use-node-data';
import { BuySellAction } from '../../types/node-enums';
import { ActionNodeSettings } from './action-node-settings';
import { BuySellPercentNodeUI } from './buy-sell-percent-node-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export class BuySellPercentNodeSettings extends ActionNodeSettings {
  action: BuySellAction;
  percent: number;
  ticker: string;

  constructor() {
    super();
    this.ticker = '';
    this.percent = 25;
    this.action = BuySellAction.Buy;
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

  getUpdatedAction(action: BuySellAction): BuySellPercentNodeSettings {
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
      onActionChange={(val: BuySellAction) => {
        let newSettings = props.data.settings.getUpdatedAction(val);
        if (
          val === BuySellAction.Sell &&
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
