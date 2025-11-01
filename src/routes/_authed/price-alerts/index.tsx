import { createFileRoute } from '@tanstack/react-router';
import AppFrame from '@/features/shared/components/app-frame';
import { PriceAlertsContainer } from '@/features/price-alerts/components/price-alerts-container';

export const Route = createFileRoute('/_authed/price-alerts/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppFrame>
      <PriceAlertsContainer />
    </AppFrame>
  );
}
