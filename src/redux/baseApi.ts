import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/** Avoid importing `./store` here (store imports baseApi → circular dependency). */
type RootStateWithAuth = { auth: { token: string | null } }

/** Serialize query params so spaces become `%20`, not `+` (URLSearchParams default). */
function serializeQueryParams(params: Record<string, unknown>): string {
    const parts: string[] = []
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue
        const encodedKey = encodeURIComponent(key)
        if (Array.isArray(value)) {
            for (const item of value) {
                if (item === undefined || item === null) continue
                parts.push(`${encodedKey}=${encodeURIComponent(String(item))}`)
            }
        } else {
            parts.push(`${encodedKey}=${encodeURIComponent(String(value))}`)
        }
    }
    return parts.join('&')
}

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL + '/api/v1',
        paramsSerializer: serializeQueryParams,
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
    tagTypes: ['Auth', 'Orders', 'Customize', 'Categories', 'Revenue', 'Users', 'Controllers', 'Subscribers', 'Promotions', 'Settings', 'PushNotifications', 'Stores', 'Products'],
    endpoints: () => ({}),
})