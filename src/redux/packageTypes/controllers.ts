import type { Controller, ControllerRole } from '@/types'
import type { Pagination } from './revenue'

/** Raw user row from GET /admin/users */
export type ControllerDto = {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  address?: string
  profileImage?: string
  permissions?: unknown[]
  status?: string
  createdAt: string
  updatedAt: string
}

export type GetControllersApiResponse = {
  success: boolean
  message: string
  pagination: Pagination
  data: ControllerDto[]
}

export type ControllerListResult = {
  items: Controller[]
  pagination: Pagination
}

export type GetControllersArgs = {
  page: number
  limit: number
  /** Sent to the API as the `search` query parameter */
  search?: string
}

export type CreateControllerBody = {
  name: string
  email: string
  phone: string
  password: string
  role: ControllerRole
  /** Store id */
  store?: string
}

function mapApiRoleToControllerRole(role: string): ControllerRole {
  const r = (role ?? '').toLowerCase()
  if (r === 'admin') return 'admin'
  return 'marketer'
}

export function controllerDtoToController(row: ControllerDto): Controller {
  return {
    id: row._id,
    name: row.name ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
    role: mapApiRoleToControllerRole(row.role ?? 'marketer'),
    // shopId/shopName are not present in the /admin/users response
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

