import { UserRole, normalizeApiRole, type UserRoleValue } from '@/types/roles'

/**
 * First screen after private entry (`/`). Uses JWT role claims (normalized slugs).
 */
export function getDefaultPrivatePathForRole(role: string): string {
  const r = normalizeApiRole(role) as UserRoleValue
  switch (r) {
    case UserRole.MARKETER:
      return '/ad-management'
    case UserRole.ADMIN:
      return '/dashboard'
    case UserRole.SUPER_ADMIN:
      return '/dashboard'
    default:
      return '/dashboard'
  }
}
