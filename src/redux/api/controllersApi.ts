import { baseApi } from '../baseApi'
import type {
  ControllerListResult,
  CreateControllerBody,
  GetControllersApiResponse,
  GetControllersArgs,
} from '../packageTypes/controllers'
import { controllerDtoToController } from '../packageTypes/controllers'

const controllersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getControllers: builder.query<ControllerListResult, GetControllersArgs>({
      query: ({ page, limit, search }) => ({
        url: '/admin/controllers',
        method: 'GET',
        params: {
          page,
          limit,
          ...(search?.trim() ? { search: search.trim() } : {}),
        },
      }),
      transformResponse: (response: GetControllersApiResponse): ControllerListResult => ({
        items: (response.data ?? []).map(controllerDtoToController),
        pagination: response.pagination,
      }),
      providesTags: ['Controllers'],
    }),
    createController: builder.mutation<unknown, CreateControllerBody>({
      query: (body) => ({
        url: '/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Controllers'],
    }),
    updateControllerStatus: builder.mutation<
      unknown,
      { id: string; status: 'active' | 'inactive' }
    >({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Controllers'],
    }),
    deleteController: builder.mutation<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/users/${id}/soft`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Controllers'],
    }),
  }),
})

export const {
    useGetControllersQuery,
    useCreateControllerMutation,
    useUpdateControllerStatusMutation,
    useDeleteControllerMutation,
} = controllersApi
