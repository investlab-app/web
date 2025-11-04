import { useNodeData } from '../../hooks/use-node-data';
import { BuySellAction } from '../../types/node-enums';
import { ActionNodeSettings } from './action-node-settings';
import { BuySellPriceNodeUI } from './buy-sell-price-node-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export class BuySellPriceNodeSettings extends ActionNodeSettings {
  action: BuySellAction;
  price: number;
  ticker: string;

  constructor() {
    super();
    this.ticker = '';
    this.price = 100;
    this.action = BuySellAction.Buy;
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      super.isValid(inConnections, outConnections) &&
      this.ticker.trim().length > 0 &&
      this.price > 0
    );
  }

  getUpdatedTicker(ticker: string): BuySellPriceNodeSettings {
    this.ticker = ticker;
    return this;
  }

  getUpdatedAction(action: BuySellAction): BuySellPriceNodeSettings {
    this.action = action;
    return this;
  }

  getUpdatedPrice(price: number): BuySellPriceNodeSettings {
    this.price = price;
    return this;
  }
}

export type BuySellPriceNode = Node<
  {
    settings: BuySellPriceNodeSettings;
  },
  CustomNodeTypes.BuySellPrice
>;

export const BuySellPriceNode = (props: NodeProps<BuySellPriceNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <BuySellPriceNodeUI
      nodeId={props.id}
      instrument={props.data.settings.ticker}
      price={props.data.settings.price}
      action={props.data.settings.action}
      onInstrumentChange={(val) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedTicker(val!),
        });
      }}
      onPriceChange={(val) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedPrice(val!),
        });
      }}
      onActionChange={(val: BuySellAction) => {
        updateNodeData({ settings: props.data.settings.getUpdatedAction(val) });
      }}
    />
  );
};
