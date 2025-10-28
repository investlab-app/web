import { useTranslation } from 'react-i18next';
import { MathNodeUI } from './math-node-ui';
import type { CustomNodeProps } from '../../types/node-props';

interface DivideNodeUIProps {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
}

export function DivideNodeUI({
  nodeId,
  preview,
  value,
  onValueChange,
}: DivideNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <MathNodeUI
      nodeId={nodeId}
      preview={preview}
      value={value}
      onValueChange={onValueChange}
    >
      <div>{t('flows.nodes.divide')}</div>
    </MathNodeUI>
  );
}
