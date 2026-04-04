import { baseApi } from '../baseApi'
import type {
  GetStoresApiResponse,
  StoreDataPayload,
  StoreListResult,
} from '../packageTypes/shop'

export type GetShopsArgs = {
  page: number
  limit: number
  search?: string
}

export type CreateShopArgs = {
  data: StoreDataPayload
  image: File
}

export type UpdateShopArgs = {
  id: string
  data: StoreDataPayload
  /** Omit or pass only when replacing the image */
  image?: File | null
}

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResult, GetProductsArgs>({
      query: ({ page, limit, search }) => ({
        url: '/admin/stores',
        method: 'GET',
        params: {
          page,
          limit,
          ...(search?.trim() ? { search: search.trim() } : {}),
        },
      }),
      transformResponse: (response: GetStoresApiResponse): StoreListResult => ({
        items: response.data ?? [],
        pagination: response.pagination,
      }),
      providesTags: ['Stores'],
    }),
    createProduct: builder.mutation<unknown, CreateProductArgs>({
      query: ({ data, image }) => {
        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        formData.append('image', image)
        return {
          url: '/admin/stores',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Stores'],
    }),
    updateProduct: builder.mutation<unknown, UpdateProductArgs>({
      query: ({ id, data, image }) => {
        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        if (image) {
          formData.append('image', image)
        }
        return {
          url: `/admin/stores/${id}`,
          method: 'PATCH',
          body: formData,
        }
      },
      invalidatesTags: ['Stores'],
    }),
    deleteProduct: builder.mutation<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/stores/${id}/soft`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Stores'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi
