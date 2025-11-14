import { getOutgoers, useReactFlow } from '@xyflow/react';
import { useValidTickers } from '../utils/ticker-validation-context';
import type {
  Connection,
  Edge,
  HandleType,
  Node,
  NodeConnection,
} from '@xyflow/react';
import type { NodeSettings } from '../nodes/node-settings';

export const useValidators = () => {
  const { isValidTicker } = useValidTickers();
  const { getNodes, getEdges, getNode } = useReactFlow();

  function _getConnectionCountsPerHandle(
    connections: Array<NodeConnection>,
    source: boolean
  ) {
    const counts: Record<string, number> = {};

    for (const conn of connections) {
      const key = source ? conn.sourceHandle : conn.targetHandle;
      if (key == null) continue;

      counts[key] = (counts[key] ?? 0) + 1;
    }

    return counts;
  }

  const _hasCycle = (
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
  };

  const validateConnection = (connection: Connection | Edge) => {
    const nodes = getNodes();
    const edges = getEdges();
    const target = nodes.find((node) => node.id === connection.target);
    const source = nodes.find((node) => node.id === connection.source);
    if (!target || !source) {
      return false;
    }
    const sourceObj = source.data.settings as NodeSettings;
    const targetObj = target.data.settings as NodeSettings;
    const allowedSupertypes = sourceObj.getAllowedSupertypes(
      connection.sourceHandle!
    );
    if (!allowedSupertypes.includes(targetObj.getSupertype())) return false;

    if (_hasCycle(target, nodes, edges, connection.source)) return false;
    return true;
  };

  const isConnectionValid = (connectionsLen: number, allowed: number) => {
    return allowed >= 0 ? connectionsLen < allowed : true;
  };

  const getAllowedConnections = (
    nodeId: string,
    type: HandleType,
    handleId: string
  ) => {
    const node = getNode(nodeId);
    if (!node) return 0;
    const obj = node.data.settings as NodeSettings;
    return obj.getAllowedConnections(type, handleId);
  };

  const validateNode = (
    nodeId: string,
    connectionsIn: Array<NodeConnection>,
    connectionsOut: Array<NodeConnection>
  ) => {
    const node = getNode(nodeId);

    if (!node) return false;

    const connectionsInCounts = _getConnectionCountsPerHandle(
      connectionsIn,
      false
    );
    const connectionsOutCounts = _getConnectionCountsPerHandle(
      connectionsOut,
      true
    );

    const obj = node.data.settings as NodeSettings;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ('ticker' in obj && !isValidTicker((obj as any).ticker)) {
      return false;
    }

    return obj.isValid(connectionsInCounts, connectionsOutCounts);
  };

  return {
    validateConnection,
    getAllowedConnections,
    validateNode,
    isConnectionValid,
  };
};
