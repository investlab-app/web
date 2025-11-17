import { useTranslation } from 'react-i18next';
import { MathNodeUI } from './math-node-ui';
import type { CustomNodeProps } from '../../types/node-props';

interface AddNodeUIProps {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
}

export function AddNodeUI({
  nodeId,
  preview,
  value,
  onValueChange,
}: AddNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <MathNodeUI
      nodeId={nodeId}
      preview={preview}
      value={value}
      onValueChange={onValueChange}
    >
      <div>{t('flows.nodes.add')}</div>
    </MathNodeUI>
  );
}
