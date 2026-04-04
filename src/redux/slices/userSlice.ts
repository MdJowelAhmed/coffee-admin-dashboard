import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User, UserFilters, PaginationState } from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

interface UserState {
  list: User[]
  filteredList: User[]
  selectedUser: User | null
  filters: UserFilters
  pagination: PaginationState
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  list: [],
  filteredList: [],
  selectedUser: null,
  filters: {
    search: '',
    status: 'all',
    role: 'all',
  },
  pagination: { ...DEFAULT_PAGINATION },
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload
      state.filteredList = action.payload
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      // Apply filters
      let filtered = [...state.list]
      
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.phone.includes(state.filters.search)
        )
      }
      
      if (state.filters.status !== 'all') {
        filtered = filtered.filter((user) => user.status === state.filters.status)
      }
      
      if (state.filters.role !== 'all') {
        filtered = filtered.filter((user) => user.role === state.filters.role)
      }
      
      state.filteredList = filtered
      state.pagination.total = filtered.length
      state.pagination.totalPages = Math.ceil(filtered.length / state.pagination.limit)
      state.pagination.page = 1
    },
    clearFilters: (state) => {
      state.filters = { search: '', status: 'all', role: 'all' }
      state.filteredList = state.list
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.ceil(state.list.length / state.pagination.limit)
      state.pagination.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.totalPages = Math.ceil(state.filteredList.length / action.payload)
      state.pagination.page = 1
    },
    updateUserStatus: (state, action: PayloadAction<{ id: string; status: User['status'] }>) => {
      const { id, status } = action.payload
      const userIndex = state.list.findIndex((u) => u.id === id)
      if (userIndex !== -1) {
        state.list[userIndex].status = status
        state.list[userIndex].updatedAt = new Date().toISOString()
      }
      const filteredIndex = state.filteredList.findIndex((u) => u.id === id)
      if (filteredIndex !== -1) {
        state.filteredList[filteredIndex].status = status
        state.filteredList[filteredIndex].updatedAt = new Date().toISOString()
      }
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.list.unshift(action.payload)
      state.filteredList.unshift(action.payload)
      state.pagination.total += 1
      state.pagination.totalPages = Math.ceil(state.filteredList.length / state.pagination.limit)
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const userIndex = state.list.findIndex((u) => u.id === action.payload.id)
      if (userIndex !== -1) {
        state.list[userIndex] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
      const filteredIndex = state.filteredList.findIndex((u) => u.id === action.payload.id)
      if (filteredIndex !== -1) {
        state.filteredList[filteredIndex] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((u) => u.id !== action.payload)
      state.filteredList = state.filteredList.filter((u) => u.id !== action.payload)
      state.pagination.total -= 1
      state.pagination.totalPages = Math.ceil(state.filteredList.length / state.pagination.limit)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setUsers,
  setSelectedUser,
  setFilters,
  clearFilters,
  setPage,
  setLimit,
  updateUserStatus,
  addUser,
  updateUser,
  deleteUser,
  setLoading,
  setError,
} = userSlice.actions

export default userSlice.reducer













