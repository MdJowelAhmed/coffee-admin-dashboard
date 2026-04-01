import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Transaction, TransactionFilters, TransactionStatus, PaginationState } from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

const initialTransactions: Transaction[] = []

interface TransactionState {
  list: Transaction[]
  filteredList: Transaction[]
  filters: TransactionFilters
  pagination: PaginationState
  isLoading: boolean
  error: string | null
}

const initialState: TransactionState = {
  list: initialTransactions,
  filteredList: initialTransactions,
  filters: {
    search: '',
    status: 'all',
  },
  pagination: {
    ...DEFAULT_PAGINATION,
    total: 0,
    totalPages: 1,
  },
  isLoading: false,
  error: null,
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.list = action.payload
      state.filteredList = action.payload
      state.pagination.total = action.payload.length
      state.pagination.totalPages = Math.ceil(
        action.payload.length / state.pagination.limit
      )
    },
    setFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      
      // Apply filters
      let filtered = [...state.list]
      
      // Search filter (ID, Status, etc.)
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase().trim()
        filtered = filtered.filter(
          (transaction) =>
            transaction.transactionId.toLowerCase().includes(searchLower) ||
            transaction.status.toLowerCase().includes(searchLower) ||
            transaction.userName.toLowerCase().includes(searchLower) ||
            transaction.email.toLowerCase().includes(searchLower)
        )
      }
      
      // Status filter
      if (state.filters.status !== 'all') {
        filtered = filtered.filter((transaction) => transaction.status === state.filters.status)
      }
      
      state.filteredList = filtered
      state.pagination.total = filtered.length
      state.pagination.totalPages = Math.ceil(
        filtered.length / state.pagination.limit
      )
      state.pagination.page = 1
    },
    clearFilters: (state) => {
      state.filters = { search: '', status: 'all' }
      state.filteredList = state.list
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.ceil(
        state.list.length / state.pagination.limit
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
    setTransactionStatus: (
      state,
      action: PayloadAction<{ id: string; status: TransactionStatus }>
    ) => {
      const { id, status } = action.payload

      const transaction = state.list.find((t) => t.id === id)
      if (transaction) {
        transaction.status = status
        transaction.updatedAt = new Date().toISOString()
      }

      const filteredTransaction = state.filteredList.find((t) => t.id === id)
      if (filteredTransaction) {
        filteredTransaction.status = status
        filteredTransaction.updatedAt = new Date().toISOString()
      }
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.list.unshift(action.payload)
      state.filteredList.unshift(action.payload)
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.ceil(
        state.list.length / state.pagination.limit
      )
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.list.findIndex((transaction) => transaction.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
      const filteredIndex = state.filteredList.findIndex((transaction) => transaction.id === action.payload.id)
      if (filteredIndex !== -1) {
        state.filteredList[filteredIndex] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((transaction) => transaction.id !== action.payload)
      state.filteredList = state.filteredList.filter((transaction) => transaction.id !== action.payload)
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.ceil(
        state.list.length / state.pagination.limit
      )
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
  setTransactions,
  setFilters,
  clearFilters,
  setPage,
  setLimit,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setLoading,
  setError,
  setTransactionStatus,
} = transactionSlice.actions

export default transactionSlice.reducer

