import { useTranslation } from 'react-i18next';
import { MathNodeUI } from './math-node-ui';
import type { CustomNodeProps } from '../../types/node-props';

interface SubtractNodeUIProps {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
}

export function SubtractNodeUI({
  nodeId,
  preview,
  value,
  onValueChange,
}: SubtractNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <MathNodeUI
      nodeId={nodeId}
      preview={preview}
      value={value}
      onValueChange={onValueChange}
    >
      <div>{t('flows.nodes.subtract')}</div>
    </MathNodeUI>
  );
}
