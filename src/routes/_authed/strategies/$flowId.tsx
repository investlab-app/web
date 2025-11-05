import { createFileRoute } from '@tanstack/react-router';
import { ReactFlowProvider } from '@xyflow/react';
import AppFrame from '@/features/shared/components/app-frame';
import { DnDProvider } from '@/features/flows/utils/dnd-context';
import { FlowsBoard } from '@/features/flows/components/flows-board';

export const Route = createFileRoute('/_authed/strategies/$flowId')({
  component: RouteComponent,
  loader: ({ params: { flowId } }) => {
    return {
      crumb: `${flowId}`,
    };
  },
});

function RouteComponent() {
  const { flowId } = Route.useParams();
  return (
    <AppFrame noXPadding>
      <ReactFlowProvider>
        <DnDProvider>
          <div className="h-[calc(100vh-var(--header-height)-2rem)]">
            <FlowsBoard id={flowId} />
          </div>
        </DnDProvider>
      </ReactFlowProvider>
    </AppFrame>
  );
}
