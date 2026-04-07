import { baseApi } from '../baseApi'
import type {
  CreateProductArgs,
  GetProductsApiResponse,
  GetProductsArgs,
  ProductListResult,
  UpdateProductArgs,
} from '../packageTypes/products'

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResult, GetProductsArgs>({
      query: ({ page, limit, search }) => ({
        url: '/products',
        method: 'GET',
        params: {
          page,
          limit,
          ...(search?.trim() ? { search: search.trim() } : {}),
        },
      }),
      transformResponse: (response: GetProductsApiResponse): ProductListResult => ({
        items: response.data ?? [],
        pagination: response.pagination,
      }),
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation<unknown, CreateProductArgs>({
      query: ({ data, image }) => {
        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        formData.append('image', image)
        return {
          url: '/products',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<unknown, UpdateProductArgs>({
      query: ({ id, data, image }) => {
        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        if (image) {
          formData.append('image', image)
        }
        return {
          url: `/products/${id}`,
          method: 'PATCH',
          body: formData,
        }
      },
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/products/${id}/soft`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi
