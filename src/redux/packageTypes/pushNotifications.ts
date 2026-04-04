import type { NotificationApiType, PushNotification } from '@/types'
import type { Pagination } from './revenue'

export type NotificationReceiverDto = {
  _id: string
  name: string
  email: string
  profileImage?: string
  phone?: string
}

export type NotificationDto = {
  _id: string
  receiver: NotificationReceiverDto
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export type GetPushNotificationsApiResponse = {
  success: boolean
  message: string
  pagination: Pagination
  data: NotificationDto[]
}

export type PushNotificationListResult = {
  items: PushNotification[]
  pagination: Pagination
}

export type GetPushNotificationsArgs = {
  page: number
  limit: number
  /** Sent as `searchTerm` query param (backend text search) */
  searchTerm?: string
  /** When not `"all"`, sent as `type` (backend enum, e.g. DAILY_SPECIAL) */
  type?: string
  /** When set, sent as `isRead` (backend boolean filter) */
  isRead?: boolean
}

export function notificationDtoToPush(row: NotificationDto): PushNotification {
  return {
    id: row._id,
    title: row.title,
    message: row.message,
    type: row.type as NotificationApiType,
    date: row.createdAt,
    status: row.isRead ? 'Read' : 'Unread',
    receiverName: row.receiver?.name,
    receiverEmail: row.receiver?.email,
  }
}
