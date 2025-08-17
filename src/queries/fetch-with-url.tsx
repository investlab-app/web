const baseUrl = import.meta.env.VITE_BACKEND_URL;

export async function fetchWithAuth(
  path: string,
  token: string
): Promise<unknown> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
