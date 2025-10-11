import { getOutgoers, useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import { allowedConnections, handleConnectionCount } from '../utils/rules';
import { TypesMapping } from '../types/node-types';
import type {
  ConnectorNodeTypes,
  RuleNodeTypes,
  TriggerNodeTypes,
} from '../types/node-types';
import type { Connection, Edge, HandleType, Node } from '@xyflow/react';

export const useValidators = () => {
  const { getNodes, getEdges } = useReactFlow();

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

  const validateConnection = useCallback(
    (connection: Connection | Edge) => {
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      const source = nodes.find((node) => node.id === connection.source);
      if (!target || !source) {
        return false;
      }
      const sourceSupertype =
        TypesMapping[
          source.type as ConnectorNodeTypes | RuleNodeTypes | TriggerNodeTypes
        ];
      const tragetSupertype =
        TypesMapping[
          target.type as ConnectorNodeTypes | RuleNodeTypes | TriggerNodeTypes
        ];
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

  const getAllowedConnections = (nodeId: string, type: HandleType) => {
    const nodes = getNodes();
    const node = nodes.find((found) => found.id === nodeId);
    if (!node) return 0;
    const supertype =
      TypesMapping[
        node.type as ConnectorNodeTypes | RuleNodeTypes | TriggerNodeTypes
      ];
    return handleConnectionCount[supertype][type];
  };

  return { validateConnection, getAllowedConnections };
};
