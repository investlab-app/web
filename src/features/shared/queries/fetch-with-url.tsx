const baseUrl = import.meta.env.VITE_BACKEND_URL;

export async function fetchWithAuth<T>(
  path: string,
  token: string
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
