import { baseApi } from '../baseApi'
import type { GetOrdersApiResponse, OrdersListResult } from '../packageTypes/orders'

export type GetOrdersArgs = {
  page: number
  limit: number
  searchTerm?: string
  orderStatus?: string
}

const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersListResult, GetOrdersArgs>({
      query: ({ page, limit, searchTerm, orderStatus }) => ({
        url: '/admin/orders',
        method: 'GET',
        params: {
          page,
          limit,
          ...(searchTerm?.trim() ? { searchTerm: searchTerm.trim() } : {}),
          ...(orderStatus && orderStatus !== 'all'
            ? { orderStatus }
            : {}),
        },
      }),
      transformResponse: (response: GetOrdersApiResponse): OrdersListResult => ({
        orders: response.data ?? [],
        pagination: response.pagination,
      }),
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<
      unknown,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = ordersApi
