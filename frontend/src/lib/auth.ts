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
  await fetchPayload('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(): Promise<unknown> {
  return fetchPayload('/users/me');
}

export async function signOut(): Promise<void> {
  await fetchPayload('/users/logout', { method: 'POST' });
}
