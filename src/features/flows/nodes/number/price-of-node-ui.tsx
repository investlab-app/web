import { useTranslation } from 'react-i18next';
import { Position } from '@xyflow/react';
import { ValidatedHandle } from '../../components/validated-handle';
import { NodeUI } from '../node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';

interface PriceOfNodeUIProps {
  value?: string;
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

      <ValidatedHandle
        type="target"
        id="out"
        nodeId={nodeId}
        position={Position.Left}
      />
    </NodeUI>
  );
}
