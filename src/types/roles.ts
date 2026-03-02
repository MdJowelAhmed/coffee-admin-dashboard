// Single-role definition
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
}

export interface RoutePermission {
  path: string
  allowedRoles: UserRole[]
  description?: string
}

// Single-role project: all protected routes are for super-admin.
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/': [UserRole.SUPER_ADMIN],
}

export const hasRouteAccess = (userRole: string, _routePath: string): boolean => {
  return userRole === UserRole.SUPER_ADMIN
}

export const shouldFilterData = (_userRole: string, _routePath: string): boolean => {
  return false
}
