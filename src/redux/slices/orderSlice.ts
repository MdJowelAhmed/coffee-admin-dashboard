import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Order, OrderFilters, OrderStatus } from '@/types'

interface OrderState {
  list: Order[]
  filteredList: Order[]
  filters: OrderFilters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  isLoading: boolean
  error: string | null
}

const initialState: OrderState = {
  list: [],
  filteredList: [],
  filters: {
    search: '',
    status: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<OrderFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }

      let filtered = [...state.list]

      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          (order) =>
            order.orderId.toLowerCase().includes(searchLower) ||
            order.title.toLowerCase().includes(searchLower) ||
            order.status.toLowerCase().includes(searchLower) ||
            order.vendor.toLowerCase().includes(searchLower)
        )
      }

      if (state.filters.status !== 'all') {
        filtered = filtered.filter(
          (order) => order.status === (state.filters.status as OrderStatus)
        )
      }

      state.filteredList = filtered
      state.pagination.total = filtered.length
      state.pagination.totalPages = Math.ceil(
        filtered.length / state.pagination.limit
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
      state.pagination.page = 1
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((order) => order.id !== action.payload)
      state.filteredList = state.filteredList.filter(
        (order) => order.id !== action.payload
      )
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.ceil(
        state.list.length / state.pagination.limit
      )
    },
  },
})

export const { setFilters, setPage, setLimit, deleteOrder } = orderSlice.actions
export default orderSlice.reducer
