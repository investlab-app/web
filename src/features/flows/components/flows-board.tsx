import { PanelRightIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDnD } from '../hooks/use-dnd';
import { useValidateBoard } from '../utils/board-validator';
import { restoreBoard } from '../utils/board-restoration';
import { useStrategyMutations } from '../hooks/strategy-mutations';
import { useValidators } from '../hooks/use-validators';
import { DragGhost } from './drag-ghost';
import { FlowsSidebar } from './sidebar/flows-sidebar';
import { FlowHeader } from './sidebar/flow-header';
import { FlowCanvas } from './flow-canvas';
import type { FlowCanvasRef } from './flow-canvas';
import type { Node, ReactFlowInstance } from '@xyflow/react';
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

  const isNewStrategy = id === 'newstrategy';
  const flowCanvasRef = useRef<FlowCanvasRef>(null);
  const [nodeType, setNodeType] = useState<string | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editedFlowName, setEditedFlowName] = useState<string>('');

  const { data: flowData } = useQuery({
    ...graphLangRetrieveOptions({
      path: { id },
    }),
    enabled: !isNewStrategy,
  });

  const flowName =
    editedFlowName || flowData?.name || (isNewStrategy ? 'New Strategy' : '');

  useEffect(() => {
    if (flowData?.raw_graph_data && rfInstance) {
      restoreBoard(flowData.raw_graph_data, rfInstance);
    }
  }, [flowData?.raw_graph_data, rfInstance]);

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
    } else {
      toast.error(t('flows.errors.cannot_rename_new_strategy'));
    }
  };

  const handleDeleteFlow = () => {
    if (!isNewStrategy) {
      deleteMutation.mutate({
        path: { id },
      });
    } else {
      toast.error(t('flows.errors.cannot_delete_new_strategy'));
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
      updateMutation.mutate({
        path: { id },
        body: {
          name: flowName,
          raw_graph_data: flow,
        },
      });
    } else {
      createMutation.mutate({
        body: {
          name: flowName,
          raw_graph_data: flow,
        },
      });
    }
  };

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
          onNameChange={setEditedFlowName}
        />
      )}
    </SidebarProvider>
  );
}
