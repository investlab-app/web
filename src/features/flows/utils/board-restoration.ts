import { hasSettingsFactory, restoreNodeSettings } from './settings-factory';
import type { Edge, Node, ReactFlowInstance } from '@xyflow/react';
import type { CustomNodeTypes } from '../types/node-types';

interface FlowData {
  nodes?: Array<Node>;
  edges?: Array<Edge>;
  viewport?: { x: number; y: number; zoom: number };
}

export function restoreBoard(
  flowData: unknown,
  rfInstance: ReactFlowInstance
): void {
  const flow = flowData as FlowData;
  const restoredNodes = (flow.nodes || []).map((node) => {
    if (node.data.settings && node.type) {
      const nodeTypeValue = node.type as CustomNodeTypes;
      if (hasSettingsFactory(nodeTypeValue)) {
        try {
          const restoredSettings = restoreNodeSettings(
            nodeTypeValue,
            node.data.settings as Record<string, unknown>
          );

          return {
            ...node,
            data: {
              ...node.data,
              settings: restoredSettings,
            },
          };
        } catch (error) {
          console.error(`Failed to restore settings for node ${node.id}:`, error);
          return node;
        }
      } 
    }
    
    return node;
  });
  
  const { x = 0, y = 0, zoom = 1 } = flow.viewport || {};
  
  rfInstance.setNodes(restoredNodes);
  rfInstance.setEdges(flow.edges || []);
  rfInstance.setViewport({ x, y, zoom });
}
