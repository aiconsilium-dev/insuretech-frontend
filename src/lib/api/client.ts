const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = document.cookie.match(/access_token=([^;]+)/)?.[1];
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (res.status === 401) {
    const ok = await tryRefresh();
    if (!ok) {
      window.dispatchEvent(new CustomEvent('auth:logout'));
      throw new ApiError(401, 'Unauthorized');
    }
    return apiFetch<T>(path, init);
  }
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, { method: 'POST', credentials: 'include' });
    return res.ok;
  } catch {
    return false;
  }
}
