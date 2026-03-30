import type { User } from '@/redux/slices/authSlice'
import { isDashboardAccessRole, normalizeApiRole } from '@/types/roles'
import { isJwtValid, readJwtPayload } from '@/utils/jwtPayload'

/** Build in-memory `User` from access token only (never persist this shape). */
export function buildUserFromAccessToken(accessToken: string): User | null {
  if (!isJwtValid(accessToken)) return null

  const payload = readJwtPayload(accessToken)
  if (!payload) return null
  const roleRaw = payload.role?.trim() ?? ''
  const role = normalizeApiRole(roleRaw)
  if (!roleRaw || !isDashboardAccessRole(role)) return null

  const email = payload.email?.trim() ?? ''
  const id = payload.id?.trim() ?? ''
  const local = email.includes('@') ? email.split('@')[0]! : email || 'User'

  return {
    id: id || 'pending',
    email,
    firstName: local,
    lastName: '',
    role,
  }
}
