import { baseApi } from '../baseApi'
import type {
  GetRevenueApiResponse,
  GetRevenueArgs,
  RevenueListResult,
} from '../packageTypes/revenue'

const revenueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRevenue: builder.query<RevenueListResult, GetRevenueArgs>({
      query: ({ page, limit, search }) => ({
        url: '/admin/revenue',
        method: 'GET',
        params: {
          page,
          limit,
          ...(search?.trim() ? { search: search.trim() } : {}),
        },
      }),
      transformResponse: (response: GetRevenueApiResponse): RevenueListResult => ({
        items: (response.data ?? []).map((row) => ({
          id: row._id,
          orderId: row.orderId,
          totalAmount: row.totalAmount,
          paymentMethod: row.paymentMethod,
          paymentStatus: row.paymentStatus,
          createdAt: row.createdAt,
        })),
        pagination: response.pagination,
      }),
      providesTags: ['Revenue'],
    }),
  }),
})

export const { useGetRevenueQuery } = revenueApi
