import { PanelRightIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { useDnD } from '../hooks/use-dnd';
import { useValidateBoard } from '../utils/board-validator';
import { hasSettingsFactory, restoreNodeSettings } from '../utils/settings-factory';
import { useValidators } from '../hooks/use-validators';
import { DragGhost } from './drag-ghost';
import { FlowsSidebar } from './sidebar/flows-sidebar';
import { FlowHeader } from './sidebar/flow-header';
import { FlowCanvas } from './flow-canvas';
import type { FlowCanvasRef } from './flow-canvas';
import type { Edge, Node, ReactFlowInstance } from '@xyflow/react';
import type { CustomNodeTypes } from '../types/node-types';
import { useTheme } from '@/features/shared/components/theme-provider';
import { useIsMobile } from '@/features/shared/hooks/use-media-query';
import { Alert, AlertDescription } from '@/features/shared/components/ui/alert';
import '@xyflow/react/dist/style.css';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/features/shared/components/ui/sidebar';
import { cn } from '@/features/shared/utils/styles';
import {
  graphLangCreateMutation,
  graphLangDestroyMutation,
  graphLangListQueryKey,
  graphLangPartialUpdateMutation,
  graphLangRetrieveOptions,
  graphLangRetrieveQueryKey,
  graphLangUpdateMutation,
} from '@/client/@tanstack/react-query.gen';

interface FlowsBoardProps {
  id: string;
}

export function FlowsBoard({ id }: FlowsBoardProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const flowCanvasRef = useRef<FlowCanvasRef>(null);
  const [nodeType, setNodeType] = useState<string | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { appTheme: theme } = useTheme();
  const {validateConnection} = useValidators();
  const {validateBoard} = useValidateBoard();
  // const { mutate: deleteFlow } = useDeleteFlow();
  
  const isNewStrategy = id === 'newstrategy';
  const [flowName, setFlowName] = useState<string>(isNewStrategy ? 'New Strategy' : '');

  // Only fetch flow data if it's not a new strategy
  const {
    data: flowData,
  } = useQuery({
    ...graphLangRetrieveOptions({
      path: { id },
    }),
    enabled: !isNewStrategy,
  });

  const navigate = useNavigate();

  // Update flowName when data is fetched
  useEffect(() => {
    if (flowData?.name && !isNewStrategy) {
      setFlowName(flowData.name);
    }
  }, [flowData?.name, isNewStrategy]);

  // Restore board data when flow data is fetched
  useEffect(() => {
    if (flowData?.raw_graph_data && rfInstance) {
      console.log('Starting board restoration...');
      const flow = flowData.raw_graph_data as {
        nodes?: Array<Node>;
        edges?: Array<Edge>;
        viewport?: { x: number; y: number; zoom: number };
      };
      
      // Restore nodes with their settings classes
      const restoredNodes = (flow.nodes || []).map((node) => {
        // Check if this node has settings that need restoration
        if (node.data.settings && node.type) {
          const nodeTypeValue = node.type as CustomNodeTypes;
          
          if (hasSettingsFactory(nodeTypeValue)) {
            console.log(`Restoring settings for node type: ${nodeTypeValue}`);
            // Restore the plain settings object to a class instance
            const restoredSettings = restoreNodeSettings(
              nodeTypeValue,
              node.data.settings as Record<string, unknown>
            );
            
            console.log('Plain settings:', node.data.settings);
            console.log('Restored settings:', restoredSettings);
            console.log('Has isValid method:', typeof restoredSettings.isValid === 'function');
            
            return {
              ...node,
              data: {
                ...node.data,
                settings: restoredSettings,
              },
            };
          } else {
            console.warn(`No factory found for node type: ${nodeTypeValue}`);
          }
        }
        
        return node;
      });
      
      console.log(`Restored ${restoredNodes.length} nodes`);
      const { x = 0, y = 0, zoom = 1 } = flow.viewport || {};
      rfInstance.setNodes(restoredNodes);
      rfInstance.setEdges(flow.edges || []);
      rfInstance.setViewport({ x, y, zoom });
    }
  }, [flowData?.raw_graph_data, rfInstance]);

  const deleteMutation = useMutation({
    ...graphLangDestroyMutation(),
    onSuccess: async () => {
      toast.success('Flow deleted successfully');
      await queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
      navigate({
        to: '/strategies',
      });
    },
    onError: (error) => {
      console.error('Failed to delete flow:', error);
      toast.error('Failed to delete flow');
    },
  });

  const createMutation = useMutation({
    ...graphLangCreateMutation(),
    onSuccess: async (data) => {
      toast.success('Flow created successfully');
      await queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
       navigate({
        to: `/strategies/${data.id}`,
      });
    },
    onError: (error) => {
      console.error('Failed to create flow:', error);
      toast.error('Failed to create flow');
    },
  });

  const updateMutation = useMutation({
    ...graphLangUpdateMutation(),
    onSuccess: () => {
      toast.success('Flow updated successfully');
            queryClient.refetchQueries({ queryKey: graphLangRetrieveQueryKey({path: {id: id}}) });
      queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
    },
    onError: (error) => {
      console.error('Failed to update flow:', error);
      toast.error('Failed to update flow');
    },
  });

  const patchNameMutation = useMutation({
    ...graphLangPartialUpdateMutation(),
    onSuccess: () => {
      toast.success('Flow name updated successfully');
      queryClient.refetchQueries({ queryKey: graphLangListQueryKey() });
    },
    onError: (error) => {
      console.error('Failed to update flow name:', error);
      toast.error('Failed to update flow name');
    },
  });

  const addNode = (node: Node) => {
    flowCanvasRef.current?.addNode(node);
  };

  const handlePatchName = (newName: string) => {
    if (!newName.trim()) {
      toast.error('Flow name cannot be empty');
      return;
    }
    
    if (!isNewStrategy) {
      patchNameMutation.mutate({
        path: { id },
        body: {
          name: newName,
        },
      });
    }
  };

  const handleDeleteFlow = () => {
    if (!isNewStrategy){

      deleteMutation.mutate({
        path : { id },
      });
    } else {
      toast.error(t('flows.errors.cannot_delete_new_strategy', ));
    }
  };

  const createOrUpdateFlow = () => {
    if (!rfInstance) return;

    if (!flowName.trim()) {
      toast.error('Flow name cannot be empty');
      return;
    }

    if (!validateBoard(rfInstance.getNodes(), rfInstance.getEdges())) {
      toast.error('Flow is invalid. Please fix the errors before saving.');
      return;
    }

    const flow = rfInstance.toObject();

    if (!isNewStrategy) {
      // Update existing flow using PUT
      updateMutation.mutate({
        path: { id },
        body: {
          name: flowName,
          raw_graph_data: flow,
        },
      });
    } else {
      // Create new flow
      createMutation.mutate({
        body: {
          name: flowName,
          raw_graph_data: flow,
        },
      });
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);


  const { isDragging } = useDnD();

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
            {t('flows.mobile.edit_restricted', {
              defaultValue:
                'You are in mobile view. You can delete or rename your strategy, but to edit it, you need a larger device.',
            })}
          </AlertDescription>
        </Alert>
        <div className="flex-1">
          <FlowCanvas
            ref={flowCanvasRef}
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
          ref={flowCanvasRef}
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
          setNodeType={setNodeType}
          addNode={addNode}
          screenToFlowPosition={rfInstance.screenToFlowPosition}
          onSave={createOrUpdateFlow}
          onDelete={handleDeleteFlow}
          name={flowName}
          onNameChange={setFlowName}
        />
      )}
    </SidebarProvider>
  );
}
