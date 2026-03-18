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
