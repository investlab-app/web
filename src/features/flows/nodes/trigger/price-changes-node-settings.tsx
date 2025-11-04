import { useNodeData } from '../../hooks/use-node-data';
import { PriceChangesNodeUI } from './price-changes-node';
import { TriggerNodeSettings } from './trigger-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { PriceDirection } from '../../types/node-enums';
import type { CustomNodeTypes } from '../../types/node-types';

export class PriceChangesNodeSettings extends TriggerNodeSettings {
  ticker: string;
  direction: PriceDirection;
  price: number;

  constructor() {
    super();
    this.ticker = '';
    this.direction = 'over' as PriceDirection;
    this.price = 100;
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

  getUpdatedTicker(ticker: string): PriceChangesNodeSettings {
    this.ticker = ticker;
    return this;
  }

  getUpdatedDirection(direction: PriceDirection): PriceChangesNodeSettings {
    this.direction = direction;
    return this;
  }

  getUpdatedPrice(price: number): PriceChangesNodeSettings {
    this.price = price;
    return this;
  }
}

export type PriceChangesNode = Node<
  {
    settings: PriceChangesNodeSettings;
  },
  CustomNodeTypes.PriceChanges
>;

export const PriceChangesNode = (props: NodeProps<PriceChangesNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <PriceChangesNodeUI
      nodeId={props.id}
      value={props.data.settings.ticker}
      direction={props.data.settings.direction}
      price={props.data.settings.price}
      onValueChange={(value) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedTicker(value),
        });
      }}
      onDirectionChange={(direction) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedDirection(direction),
        });
      }}
      onPriceChange={(price) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedPrice(price!),
        });
      }}
    />
  );
};
