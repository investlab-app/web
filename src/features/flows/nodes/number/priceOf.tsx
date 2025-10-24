import { useTranslation } from 'react-i18next';
import { Position, type Node, type NodeProps,  } from '@xyflow/react';
import type { PriceOfNodeProps } from '../../utils/price-of-node';
import type { CustomNodeTypes } from '@/features/flows/types/node-types-2';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { useNodeData } from '@/features/flows/hooks/use-node-data';
import { NodeUI } from '../node-ui';
import { CustomHandle, ValidatedHandle } from '../../components/validated-handle';

export type PriceOfNode = Node<
  {
    settings: PriceOfNodeProps;
  },
  CustomNodeTypes.PriceOf
>;

export const PriceOfNode = (
  props: NodeProps<PriceOfNode>
) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <PriceOfNodeUI
      value={props.data.settings.ticker}
      //   onValueChange={(value) => updateNodeData({ value: value! })}
        onValueChange={(value) => updateNodeData({ settings: props.data.settings.getUpdated(value!) })}
      nodeId={props.id}
    />
  );
};

interface PriceOfNodeUIProps {
  value: string;
  onValueChange?: (value: string | undefined) => void;
}

export function PriceOfNodeUI({
  value,
  onValueChange,
  nodeId,
  preview,
}: PriceOfNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <NodeUI nodeId={nodeId} preview={preview}>
      <div>{t('flows.nodes.price')}</div>

      {onValueChange && (
        <input
          className="px-2 py-1 border rounded"
          type="text"
          placeholder="AAPL"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onValueChange(e.target.value)
          }
        />
      )}

      <ValidatedHandle type="target" id="out" nodeId={nodeId} position={Position.Left} />
    </NodeUI>
  );
}
