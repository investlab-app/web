import { useCallback } from 'react';
import { useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { PriceOfNodeProps } from '../utils/price-of-node';

export function useNodeData<TData extends Record<string, boolean | string | number | PriceOfNodeProps>>(nodeId: string) {
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const updateNodeData = useCallback((updates: Partial<TData>) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates
            }
          } as Node;
        }
        return node;
      })
    );
    updateNodeInternals(nodeId);
  }, [nodeId, setNodes, updateNodeInternals]);

  return { updateNodeData };
}