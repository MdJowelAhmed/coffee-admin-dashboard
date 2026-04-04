import { baseApi } from '../baseApi'
import {
  subscriberDtoToSubscriber,
  type GetSubscribersApiResponse,
  type GetSubscribersArgs,
  type SubscriberListResult,
} from '../packageTypes/subscribers'
import type { SendMailPayload } from '@/types'

const subscriberUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribers: builder.query<SubscriberListResult, GetSubscribersArgs>({
      query: ({ page, limit, search }) => {
        const params: Record<string, string | number> = {
          page,
          limit,
        }
        const term = search?.trim()
        if (term) {
          params.search = term
          params.searchTerm = term
        }
        return {
          url: '/admin/subscribers',
          method: 'GET',
          params,
        }
      },
      transformResponse: (response: GetSubscribersApiResponse): SubscriberListResult => ({
        items: (response.data ?? []).map(subscriberDtoToSubscriber),
        pagination: response.pagination,
      }),
      providesTags: ['Subscribers'],
    }),
    sendSubscriberEmail: builder.mutation<unknown, SendMailPayload>({
      query: (body) => ({
        url: '/emailSubscriptions/send-email',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscribers'],
    }),
  }),
})

export const { useGetSubscribersQuery, useSendSubscriberEmailMutation } =
  subscriberUserApi
