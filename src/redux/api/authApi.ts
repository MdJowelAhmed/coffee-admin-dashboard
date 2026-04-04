import { baseApi } from "../baseApi";

export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        accessToken?: string;
        role?: string;
    };
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

interface VerifyEmailPayload {
    email: string;
    oneTimeCode: number ;
}

interface VerifyEmailResponse {
    success: boolean;
    message: string;
    // Backend returns the reset token in the "data" field
    data: string;
}

interface ResetPasswordPayload {
    newPassword: string;
    confirmPassword: string;
}

interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

/** User row from GET /users/profile */
export interface ProfileUserData {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    /** Preferred image field from API */
    profileImage?: string;
    /** Alternate image field (some responses use both) */
    image?: string;
    role: string;
    status?: string;
    permissions?: unknown[];
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    authProviders?: unknown[];
    deviceToken?: string | null;
    isVerified: boolean;
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface GetMyProfileResponse {
    success: boolean;
    message: string;
    data: ProfileUserData;
}

interface UpdateMyProfileResponse {
    success: boolean;
    message: string;
    data: ProfileUserData;
}

/** PATCH /users/profile — sent as multipart/form-data (file field name: `image`) */
export interface UpdateMyProfilePayload {
    name: string;
    image?: File | null;
    phone?: string;
    address?: string;
}

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
        getCurrentUser: builder.query({
            query: () => ({
                url: '/auth/current-user',
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),
        changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordPayload>({
            query: (credentials) => ({
                url: '/auth/change-password',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        forgotPassword: builder.mutation({
            query: (credentials) => ({
                url: '/auth/forget-password',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        resentOtp: builder.mutation({
            query: (credentials) => ({
                url: '/auth/resend-otp',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailPayload>({
            query: (credentials) => ({
                url: '/auth/verify-email',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Safely store the reset token from response.data into localStorage
                    if (data?.data) {
                        try {
                            if (typeof localStorage !== 'undefined') {
                                localStorage.setItem('resetPasswordToken', data.data);
                            }
                        } catch {
                            // ignore storage errors
                        }
                    }
                } catch {
                    // ignore errors; normal RTK Query error handling will apply
                }
            },
            invalidatesTags: ['Auth'],
        }),
        resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordPayload>({
            query: (credentials) => {
                // Read the reset token that was returned from verify-email
                let resetToken: string | null = null;
                try {
                    resetToken = typeof localStorage !== 'undefined'
                        ? localStorage.getItem('resetPasswordToken')
                        : null;
                } catch {
                    resetToken = null;
                }

                const headers: Record<string, string> = {};
                if (resetToken) {
                    // Backend expects this token in the Authorization header
                    headers.Authorization = resetToken;
                }

                return {
                    url: '/auth/reset-password',
                    method: 'POST',
                    body: credentials,
                    headers,
                };
            },
            invalidatesTags: ['Auth'],
        }),

        getMyProfile: builder.query<GetMyProfileResponse, void>({
            query: () => ({
                url: '/users/profile',
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),

        updateMyProfile: builder.mutation<UpdateMyProfileResponse, UpdateMyProfilePayload>({
            query: ({ name, image, phone, address }) => {
                const formData = new FormData();

                formData.append('name', name.trim());

                if (phone !== undefined) {
                    formData.append('phone', phone);
                }

                if (address !== undefined) {
                    formData.append('address', address);
                }

                if (image) {
                    formData.append('image', image);
                }

                return {
                    url: '/admin/profile',
                    method: 'PATCH',
                    body: formData,
                };
            },
            invalidatesTags: ['Auth'],
        }),


    }),

})

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useChangePasswordMutation,
    useForgotPasswordMutation,
    useVerifyEmailMutation,
    useResetPasswordMutation,
    useResentOtpMutation,
    useGetMyProfileQuery,
    useLazyGetMyProfileQuery,
    useUpdateMyProfileMutation,
 } =
    authApi