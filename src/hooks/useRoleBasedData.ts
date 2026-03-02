import { useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { UserRole } from '@/types/roles';

interface DataItem {
  businessId?: string;
  userId?: string;
  [key: string]: string | number | undefined;
}

/**
 * Single-role hook: super-admin can access all data.
 */
export const useRoleBasedData = <T extends DataItem>(data: T[]): T[] => {
  const { user } = useAppSelector((state) => state.auth)

  return useMemo(() => {
    if (!user) return []
    if (user.role === UserRole.SUPER_ADMIN) return data
    return []
  }, [data, user])
}

/**
 * Legacy helper kept for compatibility.
 * In single-role mode, super-admin is treated as admin-equivalent.
 */
export const useIsAdmin = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.role === UserRole.SUPER_ADMIN
}

/**
 * Business role removed in single-role mode.
 */
export const useIsBusiness = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  return !!user && user.role !== UserRole.SUPER_ADMIN
}

/**
 * Hook to get current user's business ID
 */
export const useBusinessId = (): string | undefined => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.businessId
}

/**
 * Hook to check if user can modify/delete an item
 */
export const useCanModifyItem = (item: DataItem): boolean => {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return false
  if (user.role === UserRole.SUPER_ADMIN) return true
  return item.businessId === user.businessId || item.userId === user.id
}
