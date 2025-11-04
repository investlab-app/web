import { useNodeData } from '../../hooks/use-node-data';
import { ValueOfAssetsNodeUI } from './value-of-assets-node-ui';
import { NumberNodeSettings } from './number-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';

export class ValueOfAssetsNodeSettings extends NumberNodeSettings {
  ticker: string;

  constructor() {
    super();
    this.ticker = '';
  }

  getUpdated(ticker: string): ValueOfAssetsNodeSettings {
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

export type ValueOfAssetsNode = Node<
  {
    settings: ValueOfAssetsNodeSettings;
  },
  CustomNodeTypes.ValueOfAssets
>;

export const ValueOfAssetsNode = (props: NodeProps<ValueOfAssetsNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <ValueOfAssetsNodeUI
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
