import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(date: string | Date, formatStr = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm')
}

export function formatTime(date: string | Date): string {
  return formatDate(date, 'h:mm a')
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num)
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function getInitials(firstName?: string, lastName?: string): string {
  // Handle undefined, null, or empty strings
  const first = firstName && firstName.trim() ? firstName.charAt(0).toUpperCase() : ''
  const last = lastName && lastName.trim() ? lastName.charAt(0).toUpperCase() : ''
  
  // If we have at least one initial, return it
  if (first || last) {
    return first + last
  }
  
  // Fallback to 'U' for User if nothing is available
  return 'U'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function generateSKU(categoryPrefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${categoryPrefix}-${timestamp}-${random}`
}

/** Server paths like `/image/foo.jpg` → full URL using API host (strip `/api/v1`). */
export function resolveMediaUrl(path: string | undefined | null): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
  const origin = base.replace(/\/api\/v1\/?$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (!origin) return normalized
  return `${origin.replace(/\/$/, '')}${normalized}`
}










