import { baseApi } from '../baseApi'
import type {
  CreateCustomizeBody,
  CustomizeListResult,
  GetCustomizeApiResponse,
  UpdateCustomizeBody,
} from '../packageTypes/customize'

export type GetCustomizeArgs = {
  page: number
  limit: number
  search?: string
  type?: 'milk' | 'syrup'
}

const shopManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query<CustomizeListResult, GetCustomizeArgs>({
      query: ({ page, limit, search, type }) => ({
        url: '/admin/stores',
        method: 'GET',
        params: {
          page,
          limit,
          ...(search?.trim() ? { search: search.trim() } : {}),
          ...(type ? { type } : {}),
        },
      }),
      transformResponse: (response: GetCustomizeApiResponse): CustomizeListResult => ({
        items: response.data ?? [],
        pagination: response.pagination,
      }),
      providesTags: ['Customize'],
    }),
    createShop: builder.mutation<unknown, CreateCustomizeBody>({
      query: (body) => ({
        url: '/admin/stores',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Customize'],
    }),
    updateShop: builder.mutation<unknown, UpdateCustomizeBody>({
      query: ({ id, ...body }) => ({
        url: `/admin/stores/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Customize'],
    }),
    deleteShop: builder.mutation<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/stores/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customize'],
    }),
  }),
})

export const {
    useGetShopsQuery,
    useCreateShopMutation,
    useUpdateShopMutation,
    useDeleteShopMutation,

} = shopManagementApi
