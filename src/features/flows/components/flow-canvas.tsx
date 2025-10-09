import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useCallback, useState } from 'react';
import type {
  Connection,
  Edge,
  Node,
  NodeTypes,
  ReactFlowInstance,
} from '@xyflow/react';
import { useTheme } from '@/features/shared/components/theme-provider';


export type FlowCanvasConfig = {
  id: string;
  nodeTypes: NodeTypes;
  onInstanceReady?: (id: string, instance: ReactFlowInstance) => void;
  onRegisterAddNode?: (id: string, fn: (node: Node) => void) => void;
};

export function FlowCanvas({
  id,
  nodeTypes,
  onInstanceReady,
  onRegisterAddNode,
}: FlowCanvasConfig) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [, setInstance] = useState<ReactFlowInstance | null>(null);
  
  const allowedTypes = Object.keys(nodeTypes);

  const { appTheme: theme } = useTheme();


  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleInit = (flow: ReactFlowInstance) => {
    setInstance(flow);
    onInstanceReady?.(id, flow);


  if (onRegisterAddNode) {
    onRegisterAddNode(id, addNode);
  }

  };

  const addNode = (node: Node) => {
    if (!allowedTypes.includes(node.type as string)) return;
    setNodes((prev) => prev.concat(node));
  };

 
  return (
    <div id={id} className="flex-1 border">
      <ReactFlowProvider>
        <ReactFlow
          colorMode={theme}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onInit={handleInit}
          fitView
        >
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
