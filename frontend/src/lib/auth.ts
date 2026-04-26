import { fetchPayload } from './payload';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export async function signUp({ email, password, name }: SignUpData): Promise<void> {
  await fetchPayload('/users', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signIn({ email, password }: SignInData): Promise<void> {
  const res = await fetchPayload<{ token: string }>('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.token) {
    localStorage.setItem('payload-token', res.token);
    // Also set as a cookie so SSR pages can forward it to Payload for authenticated requests.
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `payload-token=${res.token}; path=/; SameSite=Lax${secure}; Max-Age=604800`;
  }
}

export async function getMe(): Promise<unknown> {
  return fetchPayload('/users/me');
}

export async function signOut(): Promise<void> {
  try {
    await fetchPayload('/users/logout', { method: 'POST' });
  } catch {
    // server session may already be gone — clear locally regardless
  } finally {
    localStorage.removeItem('payload-token');
    document.cookie = 'payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export async function updateProfile(id: string, data: {
  name?: string;
  bio?: string;
  major?: string;
  school?: string;
}): Promise<void> {
  await fetchPayload(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
