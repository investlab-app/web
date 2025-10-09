import { createFileRoute } from '@tanstack/react-router';
import AppFrame from '@/features/shared/components/app-frame';
// import { FlowsBoard } from '@/features/flows/components/flows-board';
import { FlowsEditor } from '@/features/flows/components/flow-editor';

export const Route = createFileRoute('/_authed/flows/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppFrame>
      <FlowsEditor />
    </AppFrame>
  );
}
