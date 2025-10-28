import { useTranslation } from 'react-i18next';
import { MathNodeUI } from './math-node-ui';
import type { CustomNodeProps } from '../../types/node-props';

interface MultiplyNodeUIProps {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
}

export function MultiplyNodeUI({
  nodeId,
  preview,
  value,
  onValueChange,
}: MultiplyNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <MathNodeUI
      nodeId={nodeId}
      preview={preview}
      value={value}
      onValueChange={onValueChange}
    >
      <div>{t('flows.nodes.multiply')}</div>
    </MathNodeUI>
  );
}
