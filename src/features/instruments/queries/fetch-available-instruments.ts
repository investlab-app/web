import { type } from 'arktype';
import { fetchWithAuth } from '@/features/shared/queries/fetch-with-url';

type FetchAvailableInstrumentsOptions = {
  token: string;
};

const availableInstruments = type({
  instruments: 'string[]',
});

export type AvailableInstruments = typeof availableInstruments.infer;

export async function fetchAvailableInstruments({
  token,
}: FetchAvailableInstrumentsOptions) {
  const response = await fetchWithAuth('/api/instruments/available', token);

  const out = availableInstruments(response);

  if (out instanceof type.errors) {
    console.error(out.summary);
    throw new Error(out.summary);
  }

  return out.instruments;
}
