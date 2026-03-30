import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import { DASHBOARD_ACCESS_ROLES } from '@/types/roles'

const VALID_ROLES = DASHBOARD_ACCESS_ROLES

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (!VALID_ROLES.includes(user.role as (typeof VALID_ROLES)[number])) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
