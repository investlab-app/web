import { useNodeData } from '../../hooks/use-node-data';
import { BuySellAction } from '../../types/node-enums';
import { ActionNodeSettings } from './action-node-settings';
import { BuySellAmountNodeUI } from './buy-sell-amount-node-ui';
import type { CustomNodeTypes } from '../../types/node-types-2';
import type { Node, NodeProps } from '@xyflow/react';

export class BuySellAmountNodeSettings extends ActionNodeSettings {
  action: BuySellAction;
  amount: number;
  ticker: string;

  constructor() {
    super();
    this.ticker = '';
    this.amount = 1;
    this.action = BuySellAction.Buy;
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

  getUpdatedAction(action: BuySellAction): BuySellAmountNodeSettings {
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
      onActionChange={(val: BuySellAction) => {
        updateNodeData({ settings: props.data.settings.getUpdatedAction(val) });
      }}
    />
  );
};
