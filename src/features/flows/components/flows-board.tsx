import { PanelRightIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useDnD } from '../hooks/use-dnd';
import { useValidateBoard } from '../utils/board-validator';
import { useValidators } from '../hooks/use-validators';
import { useDeleteFlow } from '../hooks/use-delete-flow';
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
import { Skeleton } from '@/features/shared/components/ui/skeleton';

interface FlowsBoardProps {
  id: string;
}

export function FlowsBoard({ id }: FlowsBoardProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const flowCanvasRef = useRef<FlowCanvasRef>(null);
  const [nodeType, setNodeType] = useState<string | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { appTheme: theme } = useTheme();
  const {validateConnection} = useValidators();
  const {validateBoard} = useValidateBoard();
  const { mutate: deleteFlow } = useDeleteFlow();

  const isNewStrategy = id === 'newstrategy';

  // Only fetch flow data if it's not a new strategy
  const {
    data: flowData,
    isPending,
  } = useQuery({
    ...graphLangRetrieveOptions({
      path: { id },
    }),
    enabled: !isNewStrategy,
  });

  const flowName = isNewStrategy ? 'New Strategy' : (flowData?.name ?? '...');

  const addNode = (node: Node) => {
    flowCanvasRef.current?.addNode(node);
  };

  const handleDeleteFlow = () => {
    deleteFlow({
      path: { id },
    });
  };

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

  // Show loading skeleton while fetching flow data
  if (!isNewStrategy && isPending) {
    return (
      <div className="flex flex-col h-full mx-4 gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-full mx-4">
          <FlowHeader
            initialTitle={flowName}
            onSave={(newTitle) => {
              console.log('Saving new title:', newTitle);
            }}
            onDelete={handleDeleteFlow}
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
          onSave={onSave}
          onDelete={handleDeleteFlow}
          name={flowName}
        />
      )}
    </SidebarProvider>
  );
}
