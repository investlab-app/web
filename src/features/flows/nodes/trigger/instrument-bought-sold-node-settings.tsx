import { useNodeData } from '../../hooks/use-node-data';
import { InstrumentBoughtSoldNodeUI } from './instrument-bought-sold-node';
import { TriggerNodeSettings } from './trigger-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class InstrumentBoughtSoldNodeSettings extends TriggerNodeSettings {
  ticker: string;
  action: 'bought' | 'sold';

  constructor() {
    super();
    this.ticker = '';
    this.action = 'bought';
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

  getUpdatedTicker(ticker: string): InstrumentBoughtSoldNodeSettings {
    this.ticker = ticker;
    return this;
  }

  getUpdatedAction(
    action: 'bought' | 'sold'
  ): InstrumentBoughtSoldNodeSettings {
    this.action = action;
    return this;
  }
}

export type InstrumentBoughtSoldNode = Node<
  {
    settings: InstrumentBoughtSoldNodeSettings;
  },
  CustomNodeTypes.InstrumentBoughtSold
>;

export const InstrumentBoughtSoldNode = (
  props: NodeProps<InstrumentBoughtSoldNode>
) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <InstrumentBoughtSoldNodeUI
      nodeId={props.id}
      value={props.data.settings.ticker}
      action={props.data.settings.action}
      onValueChange={(value) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedTicker(value),
        });
      }}
      onActionChange={(action) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedAction(action),
        });
      }}
    />
  );
};
