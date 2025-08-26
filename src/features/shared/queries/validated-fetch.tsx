import { type } from 'arktype';
import type { Type } from 'arktype';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export async function validatedFetch<T extends Type<unknown>>(
  path: string,
  validator: T
): Promise<T['infer']> {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  const validation = validator(data);

  if (validation instanceof type.errors) {
    console.error('Validation failed:', validation.summary);
    throw new Error(`Validation failed: ${validation.summary}`);
  }

  return validation;
}
