const PAYLOAD_URL = import.meta.env.PUBLIC_PAYLOAD_URL ?? 'http://localhost:3000'

export async function fetchPayload<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${PAYLOAD_URL}/api${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`Payload fetch failed: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}
