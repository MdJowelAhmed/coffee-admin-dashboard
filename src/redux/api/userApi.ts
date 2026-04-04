import { baseApi } from '../baseApi'
import type {
  CustomerListResult,
  GetCustomersApiResponse,
  GetCustomersArgs,
} from '../packageTypes/users'
import { customerDtoToUser } from '../packageTypes/users'

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomerListResult, GetCustomersArgs>({
      query: ({ page, limit, search, status }) => ({
        url: '/admin/customers',
        method: 'GET',
        params: {
          page,
          limit,
          ...(search?.trim() ? { search: search.trim() } : {}),
          ...(status && status !== 'all' ? { status } : {}),
        },
      }),
      transformResponse: (response: GetCustomersApiResponse): CustomerListResult => ({
        items: (response.data ?? []).map(customerDtoToUser),
        pagination: response.pagination,
      }),
      providesTags: ['Users'],
    }),
    userStatusChange: builder.mutation<
      unknown,
      { id: string; status: 'active' | 'inactive' }
    >({
      query: ({ id, status }) => ({
        url: `/admin/customers/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const { useGetCustomersQuery, useUserStatusChangeMutation } = userApi
