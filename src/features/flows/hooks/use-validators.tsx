import { getOutgoers, useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import {
  allowedConnections,
  connectionCounts,
} from '../utils/connection-rules';
import { TypesMapping } from '../types/node-types';
import type { CustomNodeTypes } from '../types/node-types';
import type { Connection, Edge, HandleType, Node, NodeConnection } from '@xyflow/react';

export const useValidators = () => {
  const { getNodes, getEdges, getNode } = useReactFlow();

function _getConnectionCountsPerHandle(connections: Array<NodeConnection>, source: boolean) {
const counts: Array<number> = [];
  
  for (const conn of connections) {
    const key = source ? conn.sourceHandle : conn.targetHandle;
    if (key == null) continue;

    const id = parseInt(key, 10);
    if (isNaN(id)) continue;

    counts[id] = (counts[id] ?? 0) + 1;
  }

  const maxId = counts.length;
  for (let i = 0; i < maxId; i++) {
    counts[i] = counts[i] ?? 0;
  }

  return counts;
}

  const _hasCycle = useCallback(
    (
      node: Node,
      nodes: Array<Node>,
      edges: Array<Edge>,
      source: string,
      visited = new Set()
    ) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === source) return true;
        if (_hasCycle(outgoer, nodes, edges, source, visited)) return true;
      }
    },
    []
  );

  function _validateNonEmptyStrings(obj: Record<string, unknown>): boolean {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string' && value.trim() === '') {
        return false;
      }
    }
    return true;
  }

  const validateConnection = useCallback(
    (connection: Connection | Edge) => {
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      const source = nodes.find((node) => node.id === connection.source);
      if (!target || !source) {
        return false;
      }
      const sourceHandleId = Number(connection.sourceHandle);
      const sourceSupertype = TypesMapping[source.type as CustomNodeTypes];
      const tragetSupertype = TypesMapping[target.type as CustomNodeTypes];
      if (
        !allowedConnections[sourceSupertype][sourceHandleId].find(
          (supertype) => supertype == tragetSupertype
        )
      ) {
        return false;
      }

      if (_hasCycle(target, nodes, edges, connection.source)) return false;
      return true;
    },
    [getEdges, getNodes, _hasCycle]
  );

  const isConnectionValid = (connectionsLen: number, allowed: number) => {
    return allowed >= 0 ? connectionsLen < allowed : true;
  };

  const getAllowedConnections = (nodeId: string, type: HandleType, handleId: number) => {
    const node = getNode(nodeId);
    if (!node) return 0;
    const supertype = TypesMapping[node.type as CustomNodeTypes];
    return connectionCounts[supertype][type][handleId];
  };

  const validateNode = (
    nodeId: string,
    connectionsIn: Array<NodeConnection>,
    connectionsOut:  Array<NodeConnection>,
  ) => {
    const node = getNode(nodeId);
    if (!node || !_validateNonEmptyStrings(node.data)) return false;
    const supertype = TypesMapping[node.type as CustomNodeTypes];

    const connectionsInCounts = _getConnectionCountsPerHandle(connectionsIn, false);
    const connectionsOutCounts = _getConnectionCountsPerHandle(connectionsOut, true);

    for( let i = 0; i < connectionCounts[supertype]['validIn'].length; i++) {
      const minAllowed = connectionCounts[supertype]['validIn'][i];
      const count = connectionsInCounts[i] || 0;
      if (count < minAllowed) return false;
    }
    for( let i = 0; i < connectionCounts[supertype]['validOut'].length; i++) {
      const minAllowed = connectionCounts[supertype]['validOut'][i];
      const count = connectionsOutCounts[i] || 0;
      if (count < minAllowed) return false;
    }
   return true;
  };

  return {
    validateConnection,
    getAllowedConnections,
    validateNode,
    isConnectionValid,
  };
};
