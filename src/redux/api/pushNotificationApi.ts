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
      query: ({ page, limit, search, type, isRead }) => {
        const params: Record<string, string | number | boolean> = {
          page,
          limit,
        }
        const term = search?.trim()
        if (term) {
          params.search = term
          params.searchTerm = term
        }
        if (type && type !== 'all') {
          params.type = type
        }
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
