import type { ProfileUserData } from '@/redux/api/authApi'
import { normalizeApiRole } from '@/types/roles'
import { resolveMediaUrl } from '@/utils/mediaUrl'

export function profileDataToAuthUser(
  data: ProfileUserData,
  fallbackEmail?: string
) {
  const name = data.name?.trim() ?? ''
  const parts = name.split(/\s+/).filter(Boolean)
  const rawImg = (data.profileImage || data.image || '').trim()
  return {
    id: data._id,
    email: data.email || fallbackEmail || '',
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
    avatar: rawImg ? resolveMediaUrl(rawImg) : undefined,
    role: normalizeApiRole(data.role ?? ''),
  }
}
