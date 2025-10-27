import { useCallback } from 'react';
import { useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { NodeSettings } from '../nodes/node-settings';

export function useNodeData<TData extends Record<string, NodeSettings>>(
  nodeId: string
) {
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const updateNodeData = useCallback(
    (updates: Partial<TData>) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updates,
              },
            } as Node;
          }
          return node;
        })
      );
      updateNodeInternals(nodeId);
    },
    [nodeId, setNodes, updateNodeInternals]
  );

  return { updateNodeData };
}
