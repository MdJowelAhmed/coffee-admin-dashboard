import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Subscriber, SubscriberFilters } from '@/types'
import type { PaginationState } from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

const mockSubscribers: Subscriber[] = Array.from({ length: 7 }, (_, i) => ({
  id: `sub-${i + 1}`,
  userName: 'Alice johnson',
  email: 'alice123@example.com',
  date: '2026-05-20',
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i % 2 === 0 ? 'alice' : 'alice2'}`,
}))

interface SubscriberState {
  list: Subscriber[]
  filteredList: Subscriber[]
  filters: SubscriberFilters
  pagination: PaginationState
  isLoading: boolean
  error: string | null
}

const initialState: SubscriberState = {
  list: mockSubscribers,
  filteredList: mockSubscribers,
  filters: {
    search: '',
    status: 'all',
  },
  pagination: {
    ...DEFAULT_PAGINATION,
    total: mockSubscribers.length,
    totalPages: Math.ceil(mockSubscribers.length / DEFAULT_PAGINATION.limit),
  },
  isLoading: false,
  error: null,
}

function applyFilters(
  list: Subscriber[],
  filters: SubscriberFilters
): Subscriber[] {
  let filtered = [...list]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (s) =>
        s.userName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    )
  }
  return filtered
}

const subscriberSlice = createSlice({
  name: 'subscribers',
  initialState,
  reducers: {
    setSubscribers: (state, action: PayloadAction<Subscriber[]>) => {
      state.list = action.payload
      state.filteredList = applyFilters(action.payload, state.filters)
      state.pagination.total = state.filteredList.length
      state.pagination.totalPages = Math.ceil(
        state.filteredList.length / state.pagination.limit
      )
    },
    setFilters: (state, action: PayloadAction<Partial<SubscriberFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.filteredList = applyFilters(state.list, state.filters)
      state.pagination.total = state.filteredList.length
      state.pagination.totalPages = Math.ceil(
        state.filteredList.length / state.pagination.limit
      )
      state.pagination.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.totalPages = Math.ceil(
        state.filteredList.length / action.payload
      )
    },
  },
})

export const { setSubscribers, setFilters, setPage, setLimit } =
  subscriberSlice.actions
export default subscriberSlice.reducer
