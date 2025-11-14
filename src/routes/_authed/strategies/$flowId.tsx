import { createFileRoute } from '@tanstack/react-router';
import { ReactFlowProvider } from '@xyflow/react';
import AppFrame from '@/features/shared/components/app-frame';
import { DnDProvider } from '@/features/flows/utils/dnd-context';
import { FlowsBoard } from '@/features/flows/components/flows-board';
import { graphLangRetrieveOptions } from '@/client/@tanstack/react-query.gen';

export const Route = createFileRoute('/_authed/strategies/$flowId')({
  component: RouteComponent,
  loader: async ({ params: { flowId }, context: { queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        graphLangRetrieveOptions({
          path: {
            id: flowId,
          },
        })
      );
      return { crumb: data.name || `${flowId}` };
    } catch {
      return {
        crumb: `${flowId}`,
      };
    }
  },
});

function RouteComponent() {
  const { flowId } = Route.useParams();
  return (
    <AppFrame className="px-0">
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
