import { baseApi } from '../baseApi'
import {
  promotionDtoToPoster,
  type GetPromotionsApiResponse,
  type GetPromotionsArgs,
  type PromotionListResult,
} from '../packageTypes/promotions'

export type CreatePromotionArgs = {
  name: string
  image: File
}

const adManagerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPromotions: builder.query<PromotionListResult, GetPromotionsArgs>({
      query: ({ page, limit, search }) => {
        const params: Record<string, string | number> = {
          page,
          limit,
        }
        const term = search?.trim()
        if (term) {
          params.search = term
          params.searchTerm = term
        }
        return {
          url: '/promotions',
          method: 'GET',
          params,
        }
      },
      transformResponse: (response: GetPromotionsApiResponse): PromotionListResult => ({
        items: (response.data ?? []).map(promotionDtoToPoster),
        pagination: response.pagination,
      }),
      providesTags: ['Promotions'],
    }),
    createPromotion: builder.mutation<unknown, CreatePromotionArgs>({
      query: ({ name, image }) => {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('image', image)
        return {
          url: '/promotions',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Promotions'],
    }),
    deletePromotion: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Promotions'],
    }),
  }),
})

export const {
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useDeletePromotionMutation,
} = adManagerApi
