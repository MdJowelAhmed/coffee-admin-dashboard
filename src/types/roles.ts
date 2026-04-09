/**
 * API role slugs (dynamic values also accepted from `/users/profile` etc.).
 */
export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MARKETER: 'marketer',
} as const

export type UserRoleValue = (typeof UserRole)[keyof typeof UserRole]

/** Any role string returned by the backend */
export type UserRoleString = string

export const DASHBOARD_ACCESS_ROLES: readonly UserRoleValue[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MARKETER,
]

/** Normalize legacy/alternate slugs to current API values */
export function normalizeApiRole(role: string): string {
  const r = role.trim()
  const aliases: Record<string, UserRoleValue> = {
    'super-admin': UserRole.SUPER_ADMIN,
    marketing: UserRole.MARKETER,
  }
  return aliases[r] ?? r
}

export function isDashboardAccessRole(role: string): boolean {
  const normalized = normalizeApiRole(role)
  return DASHBOARD_ACCESS_ROLES.includes(normalized as UserRoleValue)
}

export interface RoutePermission {
  path: string
  allowedRoles: UserRoleValue[]
  description?: string
}

/**
 * Feature-based access matrix (values must match API `role`):
 * - super_admin: all access
 * - admin: Orders, ShopManagement (without Shop), Subscribers, Revenue, Push-notification, Profile
 * - marketer: Ad Management, Subscribers, Push-notification
 */
export const FEATURE_ACCESS: Record<string, UserRoleValue[]> = {
  dashboard: [UserRole.SUPER_ADMIN],
  orders: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  'shop-management': [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  'shop-management-shop': [UserRole.SUPER_ADMIN],
  revenue: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  'user-management': [UserRole.SUPER_ADMIN],
  subscribers: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETER],
  'ad-management': [UserRole.SUPER_ADMIN, UserRole.MARKETER],
  'push-notification': [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETER],
  controllers: [UserRole.SUPER_ADMIN],
  profile: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
}

export type FeatureKey = keyof typeof FEATURE_ACCESS

export const hasFeatureAccess = (userRole: string, feature: FeatureKey): boolean => {
  const roles = FEATURE_ACCESS[feature]
  if (!roles) return false
  const normalized = normalizeApiRole(userRole)
  return roles.includes(normalized as UserRoleValue)
}
