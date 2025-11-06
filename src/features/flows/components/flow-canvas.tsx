import { Background, ReactFlow, addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import { forwardRef, memo, useImperativeHandle } from 'react';
import { nodeTypes } from '../types/node-types-to-settings';
import type { ColorMode, Connection, Edge, Node, ReactFlowInstance } from '@xyflow/react';

const NODE_EXTENT: [[number, number], [number, number]] = [
  [-3000, -3000],
  [3000, 3000],
];

const TRANSLATE_EXTENT: [[number, number], [number, number]] = [
  [-3000, -3000],
  [3000, 3000],
];

interface FlowCanvasProps {
  theme: ColorMode;
  validateConnection: (connection: Connection | Edge) => boolean;
  onInit: (instance: ReactFlowInstance | null) => void;
  readOnly?: boolean;
}

export interface FlowCanvasRef {
  addNode: (node: Node) => void;
}

export const FlowCanvas = memo(
  forwardRef<FlowCanvasRef, FlowCanvasProps>(function FlowCanvas(
    { theme, validateConnection, onInit, readOnly },
    ref
  ) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const onConnect = (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));

    useImperativeHandle(ref, () => ({
      addNode: (node: Node) => setNodes((nds) => nds.concat(node)),
    }));

    console.log('FlowCanvas rendering');

    if (readOnly) {
      return (
<ReactFlow
        colorMode={theme}
        nodes={nodes}
        edges={edges}
        nodeExtent={NODE_EXTENT}
        translateExtent={TRANSLATE_EXTENT}
        nodeTypes={nodeTypes}
        onInit={onInit}
        zoomOnScroll={false}
        panOnDrag={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
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
  })
);

