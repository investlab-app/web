import { createFileRoute } from '@tanstack/react-router';
import AppFrame from '@/features/shared/components/app-frame';
import { FlowsBoard } from '@/features/flows/components/flows-board';

export const Route = createFileRoute('/_authed/flows/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppFrame>
      dupa daup
      <FlowsBoard />
      aaa
    </AppFrame>
  );
}
