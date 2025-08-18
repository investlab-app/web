import { type } from 'arktype';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

const availableInstruments = type({
  instruments: 'string[]',
});

export type AvailableInstruments = typeof availableInstruments.infer;

export async function fetchAvailableInstruments() {
  return validatedFetch('/api/instruments/available', availableInstruments);
}
