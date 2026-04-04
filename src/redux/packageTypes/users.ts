import type { User, UserRole, UserStatus } from '@/types'
import type { Pagination } from './revenue'

export type CustomerLocationDto = {
  latitude: number
  longitude: number
}

/** Raw customer row from GET /admin/customers */
export type CustomerDto = {
  _id: string
  name: string
  email: string
  role: string
  address?: string
  profileImage?: string
  status: string
  phone?: string
  customer?: string
  location?: CustomerLocationDto | null
  createdAt: string
  updatedAt: string
}

export type GetCustomersApiResponse = {
  success: boolean
  message: string
  pagination: Pagination
  data: CustomerDto[]
}

export type CustomerListResult = {
  items: User[]
  pagination: Pagination
}

export type GetCustomersArgs = {
  page: number
  limit: number
  /** Sent to the API as the `searchTerm` query parameter */
  search?: string
  /** When not `"all"`, sent as the `status` query parameter */
  status?: string
}

function splitDisplayName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function mapRoleToUserRole(role: string): UserRole {
  const r = role.toLowerCase()
  if (r === 'admin' || r === 'moderator' || r === 'editor' || r === 'user' || r === 'customer') {
    return r as UserRole
  }
  return 'user'
}

function mapApiStatusToUserStatus(status: string): UserStatus {
  const s = status.toLowerCase()
  if (s === 'active' || s === 'blocked' || s === 'pending' || s === 'inactive') {
    return s
  }
  return 'inactive'
}

export function customerDtoToUser(row: CustomerDto): User {
  const { firstName, lastName } = splitDisplayName(row.name ?? '')
  const avatar = row.profileImage?.trim() ? row.profileImage : undefined

  return {
    id: row._id,
    firstName,
    lastName,
    email: row.email ?? '',
    phone: row.phone ?? '',
    avatar,
    role: mapRoleToUserRole(row.role ?? 'user'),
    status: mapApiStatusToUserStatus(row.status ?? 'inactive'),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    address: row.address?.trim() ? row.address : undefined,
    city: undefined,
    country: undefined,
  }
}
