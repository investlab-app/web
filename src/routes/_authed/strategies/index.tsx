import { createFileRoute } from '@tanstack/react-router';
import { ReactFlowProvider } from '@xyflow/react';
import AppFrame from '@/features/shared/components/app-frame';
import { FlowsBoard } from '@/features/flows/components/flows-board';
import { DnDProvider } from '@/features/flows/utils/dnd-context';

export const Route = createFileRoute('/_authed/strategies/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppFrame>
      <ReactFlowProvider>
        <DnDProvider>
          <div className="h-[calc(100vh-var(--header-height)-2rem)]">
            <FlowsBoard />
          </div>
        </DnDProvider>
      </ReactFlowProvider>
    </AppFrame>
  );
}
