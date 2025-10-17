import { useTranslation } from 'react-i18next';
import { RuleNodeUI } from './rule-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';
import { useNodeData } from '@/features/flows/hooks/use-node-data';

export type HappensWithinNode = Node<
  {
    value: number;
  },
  CustomNodeTypes.HappensWithin
>;

export const HappensWithinNode = (props: NodeProps<HappensWithinNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <HappensWithinNodeUI
      nodeId={props.id}
      value={props.data.value}
      onValueChange={(value) => updateNodeData({ value: value! })}
    />
  );
};

interface HappensWithinNodeUIProps {
  value: number;
  onValueChange?: (value: number | undefined) => void;
}

export function HappensWithinNodeUI({
  value,
  onValueChange,
  nodeId,
  preview,
}: HappensWithinNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <RuleNodeUI preview={preview} nodeId={nodeId}>
      <div>{t('flows.nodes.happens_within')}</div>
      {onValueChange && (
        <NumberInput
          className="w-20 mx-2"
          min={1}
          defaultValue={1}
          value={value}
          onValueChange={onValueChange}
          decimalScale={0}
        />
      )}
      {!onValueChange && <div className="px-1">X</div>}
      <div>{t('flows.nodes.days')}</div>
    </RuleNodeUI>
  );
}
