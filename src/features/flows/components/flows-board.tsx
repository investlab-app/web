import {
  Background,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { PanelRightIcon } from 'lucide-react';
import { useState } from 'react';
import { useDnD } from '../hooks/use-dnd';
import { useValidateBoard } from '../utils/board-validator';
import { nodeTypes } from '../types/node-types-to-settings';
import { useValidators } from '../hooks/use-validators';
import { DragGhost } from './drag-ghost';
import { FlowsSidebar } from './sidebar/flows-sidebar';
import type {
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from '@xyflow/react';
import { useTheme } from '@/features/shared/components/theme-provider';
import '@xyflow/react/dist/style.css';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/features/shared/components/ui/sidebar';
import { cn } from '@/features/shared/utils/styles';

const NODE_EXTENT: [[number, number], [number, number]] = [
  [-3000, -3000],
  [3000, 3000],
];

const TRANSLATE_EXTENT: [[number, number], [number, number]] = [
  [-3000, -3000],
  [3000, 3000],
];

interface FlowsBoardProps {
  id: string;
}

export function FlowsBoard({ id }: FlowsBoardProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodeType, setNodeType] = useState<string | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { appTheme: theme } = useTheme();
  const { validateConnection } = useValidators();
  const { validateBoard } = useValidateBoard();

  const onConnect = (params: Connection) =>
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));

  const addNode = (node: Node) => setNodes((nds) => nds.concat(node));

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const onSave = () => {
    if (rfInstance) {
      if (!validateBoard(rfInstance.getNodes(), rfInstance.getEdges())) {
        alert('Flow is invalid. Please fix the errors before saving.');
        return;
      }
      const flow = rfInstance.toObject();
      localStorage.setItem('example-flow', JSON.stringify(flow));
    }
  };

  const { isDragging } = useDnD();
  console.log('FlowsBoard rendering');
  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      className="flex w-full h-full"
    >
      {isDragging && <DragGhost type={nodeType} />}

      <div className="flex-1 ml-4">
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
          onInit={setRfInstance}
          isValidConnection={validateConnection}
          zoomOnScroll={false}
        >
          <Background />
        </ReactFlow>
      </div>
      <div className={cn(' h-full w-min', sidebarOpen ? 'mr-0' : 'mr-4')}>
        <SidebarTrigger className="text-foreground">
          <PanelRightIcon />
          <span className="sr-only">Toggle Nodes Toolbox</span>
        </SidebarTrigger>
      </div>

      {rfInstance && (
        <FlowsSidebar
          setNodeType={setNodeType}
          addNode={addNode}
          screenToFlowPosition={rfInstance.screenToFlowPosition}
          onSave={onSave}
        />
      )}
    </SidebarProvider>
  );
}
