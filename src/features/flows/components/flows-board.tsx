import { PanelRightIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEdgesState, useNodesState } from '@xyflow/react';
import { useDnD } from '../hooks/use-dnd';
import { useValidateBoard } from '../utils/board-validator';
import { restoreBoard } from '../utils/board-restoration';
import { useStrategyMutations } from '../hooks/strategy-mutations';
import { useValidators } from '../hooks/use-validators';
import { DragGhost } from './drag-ghost';
import { FlowsSidebar } from './sidebar/flows-sidebar';
import { FlowHeader } from './sidebar/flow-header';
import { FlowCanvas } from './flow-canvas';
import type { Edge, Node, ReactFlowInstance } from '@xyflow/react';
import { useTheme } from '@/features/shared/components/theme-provider';
import { useIsMobile } from '@/features/shared/hooks/use-media-query';
import { Alert, AlertDescription } from '@/features/shared/components/ui/alert';
import '@xyflow/react/dist/style.css';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/features/shared/components/ui/sidebar';
import { cn } from '@/features/shared/utils/styles';
import { graphLangRetrieveOptions } from '@/client/@tanstack/react-query.gen';

interface FlowsBoardProps {
  id: string;
}

export function FlowsBoard({ id }: FlowsBoardProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { appTheme: theme } = useTheme();
  const { validateConnection } = useValidators();
  const { validateBoard } = useValidateBoard();
  const { deleteMutation, createMutation, updateMutation, patchNameMutation } =
    useStrategyMutations();
  const { isDragging } = useDnD();

  const isNewStrategy = id === 'new';
  const [nodeType, setNodeType] = useState<string | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editedFlowName, setEditedFlowName] = useState<string | undefined>(
    undefined
  );
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const lastNodeIdRef = useRef(0);

  useEffect(() => {
    if (nodes.length === 0) {
      lastNodeIdRef.current = 0;
    } else {
      lastNodeIdRef.current = Math.max(
        ...nodes.map(n => parseInt(n.id.replace('node_', '') || '0'))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length]);

  const { data: flowData } = useQuery({
    ...graphLangRetrieveOptions({
      path: { id },
    }),
    enabled: !isNewStrategy,
  });

  const flowName =
    editedFlowName !== undefined
      ? editedFlowName
      : (flowData?.name ??
        (isNewStrategy ? t('flows.placeholders.new_strategy') : ''));

  useEffect(() => {
    if (flowData?.raw_graph_data && rfInstance) {
      restoreBoard(flowData.raw_graph_data, rfInstance);
    }
  }, [flowData?.raw_graph_data, rfInstance]);

  const addNode = useCallback((node: Node) => {
    setNodes((nds) => nds.concat(node));
  }, [setNodes]);

  const handlePatchName = useCallback((newName: string) => {
    if (!newName.trim()) {
      toast.error(t('flows.errors.flow_name_empty'));
      return;
    }

    if (!isNewStrategy) {
      patchNameMutation.mutate({
        path: { id },
        body: {
          name: newName,
        },
      });
    } else {
      toast.error(t('flows.errors.cannot_rename_new_strategy'));
    }
  }, [isNewStrategy, id, patchNameMutation, t]);

  const handleDeleteFlow = useCallback(() => {
    if (!isNewStrategy) {
      deleteMutation.mutate({
        path: { id },
      });
    } else {
      toast.error(t('flows.errors.cannot_delete_new_strategy'));
    }
  }, [isNewStrategy, id, deleteMutation, t]);

  const createOrUpdateFlow = useCallback(() => {
    if (!rfInstance) return;
    if (!flowName.trim()) {
      toast.error(t('flows.errors.flow_name_empty'));
      return;
    }

    if (!validateBoard(rfInstance.getNodes(), rfInstance.getEdges())) {
      toast.error(t('flows.errors.flow_invalid'));
      return;
    }

    const flow = rfInstance.toObject();

    if (!isNewStrategy) {
      updateMutation.mutate({
        path: { id },
        body: {
          name: flowName,
          raw_graph_data: flow,
          active: true,
          repeat: false,
        },
      });
    } else {
      createMutation.mutate({
        body: {
          name: flowName,
          raw_graph_data: flow,
          active: true,
          repeat: false,
        },
      });
    }
  }, [rfInstance, flowName, validateBoard, isNewStrategy, updateMutation, id, createMutation, t]);

  const screenToFlowPosition = useCallback(
    (pos: { x: number; y: number }) => {
      return rfInstance?.screenToFlowPosition(pos) ?? pos;
    },
    [rfInstance]
  );

  if (isMobile) {
    return (
      <div className="flex flex-col h-full mx-4">
        <FlowHeader
          initialTitle={flowName}
          onSave={handlePatchName}
          onDelete={handleDeleteFlow}
          canRename={true}
        />
        <Alert className="border-warning bg-warning/10 my-4">
          <AlertDescription>
            {t('flows.errors.edit_restricted')}
          </AlertDescription>
        </Alert>
        <div className="flex-1">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            theme={theme}
            validateConnection={validateConnection}
            onInit={setRfInstance}
            readOnly
          />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      className="flex w-full"
    >
      {isDragging && <DragGhost type={nodeType} />}

      <div className="flex-1 ml-4">
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          setEdges={setEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          theme={theme}
          validateConnection={validateConnection}
          onInit={setRfInstance}
        />
      </div>
      <div className={cn(' h-full w-min', sidebarOpen ? 'mr-0' : 'mr-4')}>
        <SidebarTrigger className="text-foreground">
          <PanelRightIcon />
          <span className="sr-only">Toggle Nodes Toolbox</span>
        </SidebarTrigger>
      </div>

      {rfInstance && (
        <FlowsSidebar
          lastNodeId={lastNodeIdRef.current}
          setNodeType={setNodeType}
          addNode={addNode}
          screenToFlowPosition={screenToFlowPosition}
          onSave={createOrUpdateFlow}
          onDelete={handleDeleteFlow}
          name={flowName}
          onNameChange={setEditedFlowName}
        />
      )}
    </SidebarProvider>
  );
}
