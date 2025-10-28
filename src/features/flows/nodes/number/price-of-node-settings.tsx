import { useNodeData } from '../../hooks/use-node-data';
import { PriceOfNodeUI } from './price-of-node-ui';
import { NumberNodeSettings } from './number-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class PriceOfNodeSettings extends NumberNodeSettings {
  ticker: string;

  constructor() {
    super();
    this.ticker = '';
  }

  getUpdated(ticker: string): PriceOfNodeSettings {
    this.ticker = ticker;
    return this;
  }

  isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      super.isValid(inConnections, outConnections) &&
      this.ticker.trim().length > 0
    );
  }
}

export type PriceOfNode = Node<
  {
    settings: PriceOfNodeSettings;
  },
  CustomNodeTypes.PriceOf
>;

export const PriceOfNode = (props: NodeProps<PriceOfNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <PriceOfNodeUI
      value={props.data.settings.ticker}
      onValueChange={(value) =>
        updateNodeData({
          settings: props.data.settings.getUpdated(value ?? ''),
        })
      }
      nodeId={props.id}
    />
  );
};
