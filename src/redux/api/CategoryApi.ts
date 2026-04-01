import { baseApi } from '../baseApi'
import type {
  CategoryListResult,
  CreateCategoryBody,
  GetCategoriesApiResponse,
  GetCategoriesArgs,
  UpdateCategoryBody,
} from '../packageTypes/category'

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryListResult, GetCategoriesArgs>({
      query: ({ page, limit, search }) => ({
        url: '/admin/categories',
        method: 'GET',
        params: {
          page,
          limit,
          ...(search?.trim() ? { search: search.trim() } : {}),
        },
      }),
      transformResponse: (response: GetCategoriesApiResponse): CategoryListResult => ({
        items: (response.data ?? []).map((c) => ({
          id: c._id,
          name: c.name,
          isActive: !!c.isActive,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        })),
        pagination: response.pagination,
      }),
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation<unknown, CreateCategoryBody>({
      query: (body) => ({
        url: '/admin/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation<unknown, UpdateCategoryBody>({
      query: ({ id, ...body }) => ({
        url: `/admin/categories/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi
