import { useNodeData } from '../../hooks/use-node-data';
import { BuySellAmountNodeUI } from './buy-sell-amount-node-ui';
import { ActionNodeSettings } from './action-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class BuySellAmountNodeSettings extends ActionNodeSettings {
  action: string;
  amount: number;
  ticker: string;

  constructor() {
    super();
    this.ticker = '';
    this.amount = 1;
    this.action = 'buy';
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      super.isValid(inConnections, outConnections) &&
      this.ticker.trim().length > 0 &&
      this.amount > 0
    );
  }

  getUpdatedTicker(ticker: string): BuySellAmountNodeSettings {
    this.ticker = ticker;
    return this;
  }

  getUpdatedAction(action: string): BuySellAmountNodeSettings {
    this.action = action;
    return this;
  }

  getUpdatedAmount(amount: number): BuySellAmountNodeSettings {
    this.amount = amount;
    return this;
  }
}

export type BuySellAmountNode = Node<
  {
    settings: BuySellAmountNodeSettings;
  },
  CustomNodeTypes.BuySellAmount
>;

export const BuySellAmountNode = (props: NodeProps<BuySellAmountNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <BuySellAmountNodeUI
      nodeId={props.id}
      instrument={props.data.settings.ticker}
      amount={props.data.settings.amount}
      action={props.data.settings.action}
      onInstrumentChange={(val) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedTicker(val!),
        });
      }}
      onAmountChange={(val) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedAmount(val!),
        });
      }}
      onActionChange={(val) => {
        updateNodeData({ settings: props.data.settings.getUpdatedAction(val) });
      }}
    />
  );
};
