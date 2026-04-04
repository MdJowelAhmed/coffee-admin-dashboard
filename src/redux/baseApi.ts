import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/** Avoid importing `./store` here (store imports baseApi → circular dependency). */
type RootStateWithAuth = { auth: { token: string | null } }

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL + '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootStateWithAuth).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            // Don't set Content-Type for FormData - browser will set it with boundary
            // RTK Query will handle this automatically
            return headers
        },
    }),
    tagTypes: ['Auth', 'Orders', 'Customize', 'Categories', 'Revenue', 'Users', 'Subscribers', 'Promotions', 'Settings', 'PushNotifications'],
    endpoints: () => ({}),
})