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
  if (res.token) localStorage.setItem('payload-token', res.token);
}

export async function getMe(): Promise<unknown> {
  return fetchPayload('/users/me');
}

export async function signOut(): Promise<void> {
  try {
    await fetchPayload('/users/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem('payload-token');
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
