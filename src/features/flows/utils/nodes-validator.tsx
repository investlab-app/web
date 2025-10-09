import { CustomNodeTypes } from '../types/node-types';
import type { Edge, Node } from '@xyflow/react';

export function validateNodes(nodes: Array<Node>, edges: Array<Edge>): boolean {
  const getConnections = (
    nodeId: string,
    handleId?: string,
    type?: 'source' | 'target'
  ) => {
    return edges.filter((edge) => {
      const isSource = type === 'source';
      const isTarget = type === 'target';

      if (isSource && edge.source === nodeId) {
        return handleId ? edge.sourceHandle === handleId : true;
      }

      if (isTarget && edge.target === nodeId) {
        return handleId ? edge.targetHandle === handleId : true;
      }

      // if type is not specified, return all related edges
      return edge.source === nodeId || edge.target === nodeId;
    });
  };

  for (const node of nodes) {
    if (node.type === CustomNodeTypes.Connector) {
      const topConnections = getConnections(node.id, 'top-left', 'target');
      const bottomConnections = getConnections(
        node.id,
        'bottom-left',
        'target'
      );

      const notEnoughConnections =
        topConnections.length < 1 || bottomConnections.length < 1;

      if (notEnoughConnections) {
        console.warn(
          `Node ${node.id} is invalid: missing top or bottom inputs`
        );
        return false;
      }
    } else {
      const allConnections = getConnections(node.id);
      if (allConnections.length < 1) {
        console.warn(`Node ${node.id} is invalid: has no connections`);
        return false;
      }
    }
  }

  return true;
}
