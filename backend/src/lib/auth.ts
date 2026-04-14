import { PayloadRequest } from 'payload'
import type { User } from '../payload-types'
import { Unauthorized, Forbidden } from './errors'

export type AuthContext = {
    id: string
    role: string
    user: User
}

/**
 * authenticate
 * - Ensures a user is authenticated.
 * - On success returns AuthContext.
 * - Throws an HTTP 401 error if unauthenticated.
 *
 * Usage: call at the top of any endpoint that requires a logged-in user.
 */
export async function authenticate(req: PayloadRequest): Promise<AuthContext> {
    const user = req.user as User | null
    if (!user) throw Unauthorized()
    const id = String(user.id)
    const role = user.role ?? 'none'
    return { id, role, user }
}

/**
 * authenticateAdmin
 * - Ensures the user is authenticated and has role === 'admin'.
 * - On success returns AuthContext.
 * - Throws 401 if unauthenticated, 403 if authenticated but not admin.
 *
 * Usage: call in endpoints that only admins can use.
 */
export async function authenticateAdmin(req: PayloadRequest): Promise<AuthContext> {
    const auth = await authenticate(req)
    if (auth.role !== 'admin') throw Forbidden()
    return auth
}
