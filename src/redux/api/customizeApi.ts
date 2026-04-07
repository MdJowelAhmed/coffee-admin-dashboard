import { baseApi } from '../baseApi'
import type {
  CreateCustomizeBody,
  CreateCustomizeOptionBody,
  CustomizeListResult,
  GetCustomizeApiResponse,
  UpdateCustomizeBody,
  UpdateCustomizeOptionBody,
} from '../packageTypes/customize'

export type GetCustomizeArgs = {
  page: number
  limit: number
  search?: string
}

const customizeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomize: builder.query<CustomizeListResult, GetCustomizeArgs>({
      query: ({ page, limit, search }) => ({
        url: '/customizationOptions',
        method: 'GET',
        params: {
          page,
          limit,
          ...(search?.trim() ? { search: search.trim() } : {}),
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
        url: `/customizationOptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customize'],
    }),
    createCustomizeOption: builder.mutation<unknown, CreateCustomizeOptionBody>({
      query: ({ id, label, price }) => ({
        url: `/customizationOptions/${id}/options`,
        method: 'POST',
        body: { label, price },
      }),
      invalidatesTags: ['Customize'],
    }),
    updateCustomizeOption: builder.mutation<unknown, UpdateCustomizeOptionBody>({
      query: ({ id, optionId, label, price }) => ({
        url: `/customizationOptions/${id}/options/${optionId}`,
        method: 'PATCH',
        body: { label, price },
      }),
      invalidatesTags: ['Customize'],
    }),
    deleteCustomizeOption: builder.mutation<unknown, { id: string; optionId: string }>({
      query: ({ id, optionId }) => ({
        url: `/customizationOptions/${id}/options/${optionId}`,
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
  useCreateCustomizeOptionMutation,
  useUpdateCustomizeOptionMutation,
  useDeleteCustomizeOptionMutation,
} = customizeApi
