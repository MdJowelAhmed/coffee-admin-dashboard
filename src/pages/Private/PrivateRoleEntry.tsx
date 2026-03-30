import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import { getDefaultPrivatePathForRole } from '@/utils/privateRoleRoutes'
import { isJwtValid, readJwtPayload } from '@/utils/jwtPayload'
import { normalizeApiRole } from '@/types/roles'

/**
 * Private shell entry: reads JWT from Redux (token), picks default route by `role` claim.
 * No user JSON in localStorage — role comes from the token only.
 */
export default function PrivateRoleEntry() {
  const token = useAppSelector((s) => s.auth.token)

  if (!token || !isJwtValid(token)) {
    return <Navigate to="/auth/login" replace />
  }

  const claims = readJwtPayload(token)
  const role = claims?.role ? normalizeApiRole(claims.role) : ''
  if (!role) {
    return <Navigate to="/auth/login" replace />
  }

  const path = getDefaultPrivatePathForRole(role)
  return <Navigate to={path} replace />
}
