import { Background, ReactFlow, addEdge, reconnectEdge } from '@xyflow/react';
import { memo, useRef } from 'react';
import { nodeTypes } from '../types/node-types-to-settings';
import type {
  ColorMode,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlowInstance,
} from '@xyflow/react';

const NODE_EXTENT: [[number, number], [number, number]] = [
  [-3000, -3000],
  [3000, 3000],
];

const TRANSLATE_EXTENT: [[number, number], [number, number]] = [
  [-3000, -3000],
  [3000, 3000],
];

interface FlowCanvasProps {
  nodes: Array<Node>;
  edges: Array<Edge>;
  setEdges: React.Dispatch<React.SetStateAction<Array<Edge>>>;
  onNodesChange: (changes: Array<NodeChange>) => void;
  onEdgesChange: (changes: Array<EdgeChange>) => void;
  theme: ColorMode;
  validateConnection: (connection: Connection | Edge) => boolean;
  onInit: (instance: ReactFlowInstance | null) => void;
  readOnly?: boolean;
}

export const FlowCanvas = memo(function FlowCanvas({
  nodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
  theme,
  validateConnection,
  onInit,
  readOnly,
}: FlowCanvasProps) {
  const edgeReconnectSuccessful = useRef(true);
  const movedEdge = useRef<Edge | null>(null);

  const onConnect = (params: Connection) =>
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));

  const onReconnectStart = (_event: unknown, edge: Edge) => {
    edgeReconnectSuccessful.current = false;
    movedEdge.current = edge;
    // Remove the edge immediately to free up the connection slot
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  };

  const onReconnect = (oldEdge: Edge, newConnection: Connection) => {
    edgeReconnectSuccessful.current = true;
    setEdges((eds) => [...eds, movedEdge.current!]);
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    movedEdge.current = null;
  };

  const onReconnectEnd = () => {
    edgeReconnectSuccessful.current = true;
    movedEdge.current = null;
  };

  if (readOnly) {
    return (
      <ReactFlow
        colorMode={theme}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeExtent={NODE_EXTENT}
        translateExtent={TRANSLATE_EXTENT}
        nodeTypes={nodeTypes}
        onInit={onInit}
        zoomOnScroll={false}
        elementsSelectable={false}
        nodesDraggable={false}
      >
        <Background />
      </ReactFlow>
    );
  }

  return (
    <ReactFlow
      colorMode={theme}
      nodes={nodes}
      edges={edges}
      nodeExtent={NODE_EXTENT}
      translateExtent={TRANSLATE_EXTENT}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onInit={onInit}
      isValidConnection={validateConnection}
      zoomOnScroll={false}
      snapToGrid
      onReconnect={onReconnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      connectionRadius={30}
    >
      <Background />
    </ReactFlow>
  );
});
