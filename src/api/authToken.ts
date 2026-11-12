const ACCESS_TOKEN_KEY = 'learning-platform.access-token';

/** Навчальний приклад. Для production віддавайте перевагу HttpOnly cookie. */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window !== 'undefined') window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}
