import { useAppSelector } from '@/redux/hooks'
import { getRoleDisplayName } from '@/utils/roleHelpers'
import { selectUserRole } from '@/redux/selectors/roleBasedSelectors'

export function UserRoleIndicator() {
  const role = useAppSelector(selectUserRole)

  if (!role) return null

  const displayName = getRoleDisplayName(role)

  return (
    <div className="px-3 py-2 rounded-lg border bg-muted/50">
      <p className="text-xs text-muted-foreground">Access Role</p>
      <p className="text-sm font-medium">{displayName}</p>
    </div>
  )
}
