import { baseApi } from '../baseApi'
import type {
  DisclaimerDto,
  DisclaimerType,
  GetDisclaimerApiResponse,
  UpdateDisclaimerBody,
} from '../packageTypes/disclaimers'

type GetDisclaimerArgs = {
  type: DisclaimerType
}

const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisclaimer: builder.query<DisclaimerDto, GetDisclaimerArgs>({
      query: ({ type }) => ({
        url: `/disclaimers/${type}`,
        method: 'GET',
      }),
      transformResponse: (response: GetDisclaimerApiResponse): DisclaimerDto =>
        response.data,
      providesTags: (_result, _err, arg) => [
        { type: 'Settings' as const, id: arg.type },
      ],
    }),
    updateDisclaimer: builder.mutation<unknown, UpdateDisclaimerBody>({
      query: (body) => ({
        url: '/disclaimers',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _err, arg) => [
        { type: 'Settings' as const, id: arg.type },
      ],
    }),
  }),
})

export const { useGetDisclaimerQuery, useUpdateDisclaimerMutation } = settingsApi
