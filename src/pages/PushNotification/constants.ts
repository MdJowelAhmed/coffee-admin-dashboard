import type { NotificationApiType } from '@/types'

export const NOTIFICATION_TYPES: {
  value: NotificationApiType
  label: string
}[] = [
  { value: 'ORDER', label: 'Order' },
  { value: 'PAYMENT', label: 'Payment' },
  { value: 'PROMOTION', label: 'Promotion' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'DAILY_SPECIAL', label: 'Daily special' },
  { value: 'NEW_DRINK', label: 'New drink' },
]
