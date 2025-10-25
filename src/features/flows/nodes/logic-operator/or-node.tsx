import { useTranslation } from 'react-i18next';
import { ConnectorNodeUI } from './connector-node-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeProps } from '../../types/node-props';

export type OrNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.Or
>;

export const OrNode = (props: NodeProps<OrNode>) => {
  return <OrNodeUI nodeId={props.id} />;
};

export function OrNodeUI({ nodeId, preview }: CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <ConnectorNodeUI nodeId={nodeId} preview={preview}>
      {t('flows.nodes.or').toUpperCase()}
    </ConnectorNodeUI>
  );
}
