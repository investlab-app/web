import { getOutgoers, useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import {
  allowedConnections,
  connectionCounts,
} from '../utils/connection-rules';
import { TypesMapping } from '../types/node-types';
import type { CustomNodeTypes } from '../types/node-types';
import type { Connection, Edge, HandleType, Node } from '@xyflow/react';

export const useValidators = () => {
  const { getNodes, getEdges, getNode } = useReactFlow();

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
      const sourceSupertype = TypesMapping[source.type as CustomNodeTypes];
      const tragetSupertype = TypesMapping[target.type as CustomNodeTypes];
      console.log(sourceSupertype, tragetSupertype);
      if (
        !allowedConnections[sourceSupertype].find(
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

  const getAllowedConnections = (nodeId: string, type: HandleType) => {
    const node = getNode(nodeId);
    if (!node) return 0;
    const supertype = TypesMapping[node.type as CustomNodeTypes];
    return connectionCounts[supertype][type];
  };

  const validateNode = (
    nodeId: string,
    connectionsIn: number,
    connectionsOut: number
  ) => {
    const node = getNode(nodeId);
    if (!node || !_validateNonEmptyStrings(node.data)) return false;
    const supertype = TypesMapping[node.type as CustomNodeTypes];
    const minAllowedIn = connectionCounts[supertype]['validIn'];
    const minAllowedOut = connectionCounts[supertype]['validOut'];

    const inValid = connectionsIn >= minAllowedIn;
    const outValid = connectionsOut >= minAllowedOut;
    return inValid && outValid;
  };

  return {
    validateConnection,
    getAllowedConnections,
    validateNode,
    isConnectionValid,
  };
};
