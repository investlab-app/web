import { createFileRoute } from '@tanstack/react-router';
import InstrumentDetails from '@/features/instruments/components/instrument-details';

export const Route = createFileRoute('/instruments/$instrumentId')({
  component: RouteComponent,
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

  return <InstrumentDetails instrument={mockInstrument} />;
}
