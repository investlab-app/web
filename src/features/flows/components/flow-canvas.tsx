import {
  Background,
  ReactFlow,
  addEdge,
} from '@xyflow/react';
import { memo } from 'react';
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
  const onConnect = (params: Connection) =>
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));

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
    >
      <Background />
    </ReactFlow>
  );
});
