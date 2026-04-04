import { baseApi } from '../baseApi'
import {
  notificationDtoToPush,
  type GetPushNotificationsApiResponse,
  type GetPushNotificationsArgs,
  type PushNotificationListResult,
} from '../packageTypes/pushNotifications'
import type { SendNotificationPayload } from '@/types'

const pushNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPushNotifications: builder.query<
      PushNotificationListResult,
      GetPushNotificationsArgs
    >({
      query: ({ page, limit, searchTerm, type, isRead }) => {
        const params: Record<string, string | number | boolean> = {
          page,
          limit,
        }
        const term = searchTerm?.trim()
        if (term) {
          params.searchTerm = term
        }
        // Backend filters by exact notification type (e.g. DAILY_SPECIAL, ORDER)
        if (type && type !== 'all') {
          params.type = type
        }
        // Backend filters read/unread when present
        if (isRead !== undefined) {
          params.isRead = isRead
        }
        return {
          url: '/notifications/all-notifications',
          method: 'GET',
          params,
        }
      },
      transformResponse: (
        response: GetPushNotificationsApiResponse
      ): PushNotificationListResult => ({
        items: (response.data ?? []).map(notificationDtoToPush),
        pagination: response.pagination,
      }),
      providesTags: ['PushNotifications'],
    }),
    sendPushNotification: builder.mutation<unknown, SendNotificationPayload>({
      query: (body) => ({
        url: '/notifications/send-notification',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PushNotifications'],
    }),
  }),
})

export const { useGetPushNotificationsQuery, useSendPushNotificationMutation } =
  pushNotificationApi
