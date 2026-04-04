import type { Subscriber } from '@/types'
import type { Pagination } from './revenue'

/** Raw row from GET /admin/subscribers */
export type SubscriberDto = {
  _id: string
  email: string
  isSubscribed: boolean
  subscribedAt: string | null
  unsubscribedAt: string | null
  createdAt: string
  updatedAt: string
}

export type GetSubscribersApiResponse = {
  success: boolean
  message: string
  pagination: Pagination
  data: SubscriberDto[]
}

export type SubscriberListResult = {
  items: Subscriber[]
  pagination: Pagination
}

export type GetSubscribersArgs = {
  page: number
  limit: number
  /** Sent as `search` / `searchTerm` query params */
  search?: string
}

function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? email
  const segment = local.split('+')[0] ?? local
  const words = segment.split(/[._-]/).filter(Boolean)
  if (words.length === 0) return email
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export function subscriberDtoToSubscriber(row: SubscriberDto): Subscriber {
  const dateIso = row.subscribedAt || row.createdAt
  return {
    id: row._id,
    userName: displayNameFromEmail(row.email),
    email: row.email,
    date: dateIso,
    isSubscribed: row.isSubscribed,
    subscribedAt: row.subscribedAt,
    unsubscribedAt: row.unsubscribedAt,
  }
}
