import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import { UserRole } from '@/types/roles'

interface RoleBasedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
}

// Kept for backward compatibility, but project is now super-admin only.
export const RoleBasedRoute = ({ children }: RoleBasedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (user.role !== UserRole.SUPER_ADMIN) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}

interface RouteGuardProps {
  children: ReactNode
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated || !user || user.role !== UserRole.SUPER_ADMIN) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
