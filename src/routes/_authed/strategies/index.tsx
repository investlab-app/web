import { createFileRoute } from '@tanstack/react-router';
import AppFrame from '@/features/shared/components/app-frame';
import { FlowsView } from '@/features/flows/components/flows-view';

export const Route = createFileRoute('/_authed/strategies/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppFrame>
      <FlowsView />
    </AppFrame>
  );
}
