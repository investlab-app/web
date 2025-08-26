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
  console.log('inside');
  console.log(data);
  const validation = validator(data);
  console.log(validation);
  if (validation instanceof type.errors) {
    console.error('Validation failed:', validation.summary);
    throw new Error(`Validation failed: ${validation.summary}`);
  }

  return validation;
}
