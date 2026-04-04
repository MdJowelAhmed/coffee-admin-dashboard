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
      query: ({ page, limit, search, status }) => {
        const params: Record<string, string | number> = {
          page,
          limit,
        }
        const term = search?.trim()
        if (term) {
          params.search = term
          params.searchTerm = term
        }
        if (status && status !== 'all') {
          params.status = status
        }
        return {
          url: '/admin/customers',
          method: 'GET',
          params,
        }
      },
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
