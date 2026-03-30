import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { buildUserFromAccessToken } from '@/utils/authFromJwt'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  /** Mirror of JWT / profile role; kept in Redux only — not written to localStorage */
  role: string
  businessId?: string
  businessName?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  passwordResetEmail: string | null
  verificationEmail: string | null
}

function readSessionFromStoredToken(): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> {
  const token = localStorage.getItem('token')
  if (!token) {
    return { user: null, token: null, isAuthenticated: false }
  }

  const user = buildUserFromAccessToken(token)
  if (!user) {
    localStorage.removeItem('token')
    try {
      localStorage.removeItem('user')
    } catch {
      /* ignore */
    }
    return { user: null, token: null, isAuthenticated: false }
  }

  return { user, token, isAuthenticated: true }
}

function getInitialAuthState(): AuthState {
  const session = readSessionFromStoredToken()
  return {
    ...session,
    isLoading: false,
    error: null,
    passwordResetEmail: null,
    verificationEmail: null,
  }
}

const initialState: AuthState = getInitialAuthState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
      localStorage.setItem('token', action.payload.token)
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    /** Saves token only (localStorage + Redux). User should be rebuilt from JWT or profile in memory. */
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
      const user = buildUserFromAccessToken(action.payload)
      if (user) {
        state.user = user
        state.isAuthenticated = true
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
      try {
        localStorage.removeItem('user')
      } catch {
        /* ignore */
      }
    },
    setPasswordResetEmail: (state, action: PayloadAction<string>) => {
      state.passwordResetEmail = action.payload
    },
    setVerificationEmail: (state, action: PayloadAction<string>) => {
      state.verificationEmail = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    /** Re-read only `token` from localStorage and rebuild Redux `user` from JWT (no `user` key in LS). */
    hydrateSessionFromToken: (state) => {
      const session = readSessionFromStoredToken()
      state.user = session.user
      state.token = session.token
      state.isAuthenticated = session.isAuthenticated
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setAuthToken,
  logout,
  setPasswordResetEmail,
  setVerificationEmail,
  clearError,
  setLoading,
  hydrateSessionFromToken,
} = authSlice.actions

/** @deprecated Use hydrateSessionFromToken */
export const loadUserFromStorage = hydrateSessionFromToken

export default authSlice.reducer
