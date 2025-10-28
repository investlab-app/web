import { useNodeData } from '../../hooks/use-node-data';
import { NumberOfAssetsNodeUI } from './number-of-assets-node-ui';
import { NumberNodeSettings } from './number-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class NumberOfAssetsNodeSettings extends NumberNodeSettings {
  ticker: string;

  constructor() {
    super();
    this.ticker = '';
  }

  getUpdated(ticker: string): NumberOfAssetsNodeSettings {
    this.ticker = ticker;
    return this;
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      super.isValid(inConnections, outConnections) &&
      this.ticker.trim().length > 0
    );
  }
}

export type NumberOfAssetsNode = Node<
  {
    settings: NumberOfAssetsNodeSettings;
  },
  CustomNodeTypes.NumberOfAssets
>;

export const NumberOfAssetsNode = (props: NodeProps<NumberOfAssetsNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <NumberOfAssetsNodeUI
      value={props.data.settings.ticker}
      onValueChange={(value: string | undefined) =>
        updateNodeData({
          settings: props.data.settings.getUpdated(value ?? ''),
        })
      }
      nodeId={props.id}
    />
  );
};
