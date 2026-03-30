import type { GetMyProfileResponse } from '@/redux/api/authApi'
import { normalizeApiRole } from '@/types/roles'

export function profileDataToAuthUser(
  data: GetMyProfileResponse['data'],
  fallbackEmail?: string
) {
  const name = data.name?.trim() ?? ''
  const parts = name.split(/\s+/).filter(Boolean)
  return {
    id: data._id,
    email: data.email || fallbackEmail || '',
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
    avatar: data.profileImage,
    role: normalizeApiRole(data.role ?? ''),
  }
}
