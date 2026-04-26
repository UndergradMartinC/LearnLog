/**
 * Extracts the `payload-token` JWT from a raw Cookie header string and returns
 * an Authorization header object for server-side Payload API calls.
 *
 * Vercel strips the Cookie header when proxying to the backend via rewrites,
 * so we pass the token as `Authorization: JWT <token>` instead, which Payload
 * accepts without any CSRF checks.
 */
export function payloadAuthHeaders(cookie: string): { Authorization: string } | Record<string, never> {
  const token = cookie.match(/(?:^|;\s*)payload-token=([^;]+)/)?.[1] ?? '';
  if (!token) return {};
  return { Authorization: `JWT ${token}` };
}
