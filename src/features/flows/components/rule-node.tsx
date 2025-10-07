import { Handle, Position, useNodeConnections } from '@xyflow/react';
import { memo } from 'react';
import type { ReactNode } from 'react';
import type { Node, NodeProps } from '@xyflow/react';

export type RuleNode = Node<
  {
    children?: Array<ReactNode>;
  },
  'ruleNode'
>;

export const RuleNode = memo((props: NodeProps<RuleNode>) => {
  const connections = useNodeConnections({ id: props.id });
  return (
    <div className="p-2 border border-[#555] rounded min-w-[100px]">
      {props.data.children}

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={connections.length < 1}
      />
    </div>
  );
});
