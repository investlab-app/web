import { type } from 'arktype';
import type { Type } from 'arktype';

interface HttpRequestProps<T extends Type<unknown>> {
  base?: string | URL;
  endpoint: string;
  searchParams?: Record<string, unknown>;
  validator: T;
  method?: string;
  body?: BodyInit | null;
  headers?: HeadersInit | undefined;
}

export async function httpRequest<T extends Type<unknown>>({
  base = window.location.origin,
  endpoint,
  searchParams,
  validator,
  method = 'GET',
  body,
  headers,
}: HttpRequestProps<T>): Promise<T['infer']> {
  const url = new URL(endpoint, base);
  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url, {
    method,
    body,
    headers,
  });
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  const validation = validator(data);

  if (validation instanceof type.errors) {
    console.error('Validation failed:', validation.summary);
    throw new Error(`Validation failed: ${validation.summary}`);
  }

  return validation;
}
