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

const customizeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomize: builder.query<CustomizeListResult, GetCustomizeArgs>({
      query: ({ page, limit, search, type }) => ({
        url: '/customizationOptions',
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
    createCustomize: builder.mutation<unknown, CreateCustomizeBody>({
      query: (body) => ({
        url: '/customizationOptions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Customize'],
    }),
    updateCustomize: builder.mutation<unknown, UpdateCustomizeBody>({
      query: ({ id, ...body }) => ({
        url: `/customizationOptions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Customize'],
    }),
    deleteCustomize: builder.mutation<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/customize/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customize'],
    }),
  }),
})

export const {
  useGetCustomizeQuery,
  useCreateCustomizeMutation,
  useUpdateCustomizeMutation,
  useDeleteCustomizeMutation,
} = customizeApi
