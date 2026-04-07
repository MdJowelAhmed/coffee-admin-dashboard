import { baseApi } from '../baseApi'
import type {
  GetStoresApiResponse,
  StoreDataPayload,
  StoreListResult,
} from '../packageTypes/shop'

export type GetShopsArgs = {
  page: number
  limit: number
  /** Query param name matches backend: `searchterm` */
  searchTerm?: string
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

const shopManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query<StoreListResult, GetShopsArgs>({
      query: ({ page, limit, searchTerm }) => ({
        url: '/admin/stores',
        method: 'GET',
        params: {
          page,
          limit,
          ...(searchTerm?.trim() ? { searchTerm: searchTerm.trim() } : {}),
        },
      }),
      transformResponse: (response: GetStoresApiResponse): StoreListResult => ({
        items: response.data ?? [],
        pagination: response.pagination,
      }),
      providesTags: ['Stores'],
    }),
    createShop: builder.mutation<unknown, CreateShopArgs>({
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
    updateShop: builder.mutation<unknown, UpdateShopArgs>({
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
    deleteShop: builder.mutation<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/stores/${id}/soft`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Stores'],
    }),
  }),
})

export const {
  useGetShopsQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
} = shopManagementApi
