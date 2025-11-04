import { useValidators } from '../hooks/use-validators';
import type { Edge, Node, NodeConnection } from '@xyflow/react';

/**
 * Converts an array of Edge objects to NodeConnection objects.
 * @param edges - Array of edges to convert
 * @returns Array of node connections
 */
export function edgesToNodeConnections(
  edges: ReadonlyArray<Edge>
): Array<NodeConnection> {
  return edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? null,
    targetHandle: edge.targetHandle ?? null,
    edgeId: edge.id,
  }));
}

export function useValidateBoard() {
  const { validateNode } = useValidators();

  const getConnections = (
    nodeId: string,
    type: 'source' | 'target',
    edges: ReadonlyArray<NodeConnection>
  ) => {
    return edges.filter((edge) => {
      const isSource = type === 'source';

      if (isSource) {
        return edge.source === nodeId;
      } else {
        return edge.target === nodeId;
      }
    });
  };

  const validateBoard = (
    nodes: ReadonlyArray<Node>,
    edges: ReadonlyArray<Edge>
  ): boolean => {
    const nodeConnections = edgesToNodeConnections(edges);

    for (const node of nodes) {
      const inConnections = getConnections(node.id, 'target', nodeConnections);
      const outConnections = getConnections(node.id, 'source', nodeConnections);

      if (!validateNode(node.id, inConnections, outConnections)) {
        return false;
      }
    }

    return true;
  };

  return { validateBoard };
}
