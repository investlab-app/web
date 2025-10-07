import { createFileRoute } from '@tanstack/react-router';
import AppFrame from '@/features/shared/components/app-frame';
import { Test } from '@/features/flows/components/test';

export const Route = createFileRoute('/_authed/flows/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppFrame>
      dupa daup
      <Test />
      aaa
    </AppFrame>
  );
}
