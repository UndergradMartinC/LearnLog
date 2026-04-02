const PAYLOAD_URL = import.meta.env.PUBLIC_PAYLOAD_URL ?? 'http://localhost:3000'

export async function fetchPayload<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${PAYLOAD_URL}/api${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  const contentType = res.headers.get('content-type') ?? ''
  const isJSON = contentType.includes('application/json')
  const body = isJSON ? await res.json() : await res.text()

  if (!res.ok) {
    const jsonBody = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : null
    const errorFromList =
      Array.isArray(jsonBody?.errors) && jsonBody.errors.length > 0
        ? ((jsonBody.errors[0] as { message?: string })?.message ?? '')
        : ''
    const errorFromMessage =
      typeof jsonBody?.message === 'string'
        ? jsonBody.message
        : typeof body === 'string'
          ? body
          : ''

    const reason = errorFromList || errorFromMessage || res.statusText
    throw new Error(`Payload fetch failed: ${res.status} ${reason}`)
  }

  return body as T
}
