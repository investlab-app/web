import { createFileRoute } from '@tanstack/react-router';
import InstrumentDetails from '@/features/instruments/components/instrument-details';
import AppFrame from '@/features/shared/components/app-frame';

export const Route = createFileRoute('/_authed/instruments/$instrumentId')({
  component: RouteComponent,
  loader: ({ params: { instrumentId } }) => ({
    crumb: instrumentId,
  }),
});

function RouteComponent() {
  const { instrumentId } = Route.useParams();

  void instrumentId;

  const mockInstrument = {
    name: 'Mock Instrument',
    volume: 123456,
    currentPrice: 150.25,
    dayChange: 2.34,
    symbol: 'MOCK',
  };

  return (
    <AppFrame>
      <InstrumentDetails instrument={mockInstrument} />
    </AppFrame>
  );
}
