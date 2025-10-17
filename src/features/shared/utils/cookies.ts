export function setCookie(name: string, value: string, days?: number): void {
  const expires = days ? new Date(Date.now() + days * 864e5).toUTCString() : '';
  const cookieValue = encodeURIComponent(value);
  const expiresPart = expires ? `;expires=${expires}` : '';
  document.cookie = `${name}=${cookieValue}${expiresPart};path=/`;
}

export function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match.pop() as string) : '';
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}
