import type { Shop } from '@/types'

export interface StorePagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

/** Legacy per-day hours returned by GET /admin/stores */
export interface ApiStoreHour {
  day: string
  open: string
  close: string
}

export interface ApiStoreItem {
  _id: string
  name: string
  image?: string
  address: string
  phone: string
  about?: string
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }
  hours?: ApiStoreHour[]
  /** Present on newer API responses */
  openTime?: string
  closeTime?: string
  offDay?: string
  isActive?: boolean
  isDeleted?: boolean
  isOpen?: boolean
  createdAt: string
  updatedAt: string
  timezone?: string
  stripeAccountId?: string
  /** Stripe onboarding completed */
  isConnectedAccountReady?: boolean
  __v?: number
}

export interface GetStoresApiResponse {
  success: boolean
  message: string
  pagination: StorePagination
  data: ApiStoreItem[]
}

export interface StoreListResult {
  items: ApiStoreItem[]
  pagination: StorePagination
}

/** JSON stringified in multipart field `data` */
export interface StoreDataPayload {
  name: string
  address: string
  latitude: string
  longitude: string
  phone: string
  about: string
  openTime: string
  closeTime: string
  offDay: string
  isActive?: boolean
}

/** Build PATCH/POST `data` from a `Shop` row (e.g. list toggle). */
export function shopToStoreDataPayload(
  shop: Shop,
  overrides?: Partial<Pick<StoreDataPayload, 'isActive'>>,
): StoreDataPayload {
  return {
    name: shop.shopName,
    address: shop.location,
    latitude: shop.latitude ?? '',
    longitude: shop.longitude ?? '',
    phone: shop.contact,
    about: shop.aboutShop,
    openTime: shop.openTime,
    closeTime: shop.closeTime,
    offDay: shop.offDay ?? '',
    isActive:
      overrides?.isActive !== undefined ? overrides.isActive : shop.isActive,
  }
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

/** Normalize API time strings for HTML time inputs (HH:mm). */
export function normalizeTimeForInput(t: string): string {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return t
  const h = m[1].padStart(2, '0')
  return `${h}:${m[2]}`
}

/**
 * Prefer flat openTime/closeTime/offDay from API; otherwise derive from legacy `hours`
 * (single schedule + first weekday missing from the list as off day).
 */
export function deriveScheduleFromApiStore(item: ApiStoreItem): {
  openTime: string
  closeTime: string
  offDay: string | undefined
} {
  const apiOffDay = item.offDay?.trim() || undefined

  if (item.openTime && item.closeTime) {
    return {
      openTime: normalizeTimeForInput(item.openTime),
      closeTime: normalizeTimeForInput(item.closeTime),
      offDay: apiOffDay,
    }
  }
  const hours = item.hours ?? []
  if (hours.length === 0) {
    return {
      openTime: '09:00',
      closeTime: '18:00',
      offDay: apiOffDay,
    }
  }
  const monday = hours.find((h) => h.day === 'Monday')
  const pick = monday ?? hours[0]
  const present = new Set(hours.map((h) => h.day))
  const derivedOff = WEEKDAYS.find((d) => !present.has(d))
  return {
    openTime: normalizeTimeForInput(pick.open),
    closeTime: normalizeTimeForInput(pick.close),
    // Prefer explicit API offDay; else first weekday missing from `hours` (partial week)
    offDay: apiOffDay ?? derivedOff ?? undefined,
  }
}

export function resolveStoreImageUrl(
  imagePath: string | undefined,
  apiBase: string
): string | undefined {
  if (!imagePath) return undefined
  if (imagePath.startsWith('http')) return imagePath
  const base = apiBase.replace(/\/$/, '')
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${base}${path}`
}

export function apiStoreToShop(item: ApiStoreItem, apiBaseUrl: string): Shop {
  const coords = item.location?.coordinates
  const lng = coords?.[0]
  const lat = coords?.[1]
  const { openTime, closeTime, offDay } = deriveScheduleFromApiStore(item)
  return {
    id: item._id,
    shopName: item.name,
    contact: item.phone,
    location: item.address,
    latitude: lat != null ? String(lat) : '',
    longitude: lng != null ? String(lng) : '',
    openTime,
    closeTime,
    offDay,
    aboutShop: item.about ?? '',
    shopPicture: resolveStoreImageUrl(item.image, apiBaseUrl),
    isActive: item.isActive ?? true,
    isConnectedAccountReady: item.isConnectedAccountReady ?? false,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}
