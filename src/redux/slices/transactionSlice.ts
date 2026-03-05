import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Transaction, TransactionFilters, TransactionStatus, PaginationState } from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

// Mock data for Revenue List - matches design: #TRX-XXXX, COFFECITO Wallet, Digital Gift Card, Payment by Stripe
const mockTransactions: Transaction[] = [
  { id: '1', transactionId: '#TRX-8821', date: '2025-10-27', userName: 'Alice Johnson', email: 'alice@example.com', amount: 46.91, currency: 'EUR', status: 'Completed', paymentMethod: 'COFFECITO Wallet', description: 'Coffee purchase', createdAt: '2025-10-27T13:00:00Z', updatedAt: '2025-10-27T13:00:00Z' },
  { id: '2', transactionId: '#TRX-8822', date: '2025-10-27', userName: 'John Smith', email: 'john@example.com', amount: 25.50, currency: 'EUR', status: 'Pending', paymentMethod: 'Digital Gift Card', description: 'Gift card redemption', createdAt: '2025-10-27T14:30:00Z', updatedAt: '2025-10-27T14:30:00Z' },
  { id: '3', transactionId: '#TRX-8823', date: '2025-10-26', userName: 'Emma Wilson', email: 'emma@example.com', amount: 89.99, currency: 'EUR', status: 'Completed', paymentMethod: 'Payment by Stripe', description: 'Subscription payment', createdAt: '2025-10-26T10:15:00Z', updatedAt: '2025-10-26T10:15:00Z' },
  { id: '4', transactionId: '#TRX-8824', date: '2025-10-26', userName: 'Michael Brown', email: 'michael@example.com', amount: 12.75, currency: 'EUR', status: 'Completed', paymentMethod: 'COFFECITO Wallet', description: 'Coffee order', createdAt: '2025-10-26T16:45:00Z', updatedAt: '2025-10-26T16:45:00Z' },
  { id: '5', transactionId: '#TRX-8825', date: '2025-10-25', userName: 'Sarah Davis', email: 'sarah@example.com', amount: 150.00, currency: 'EUR', status: 'Pending', paymentMethod: 'Digital Gift Card', description: 'Gift card purchase', createdAt: '2025-10-25T09:20:00Z', updatedAt: '2025-10-25T09:20:00Z' },
  { id: '6', transactionId: '#TRX-8826', date: '2025-10-25', userName: 'David Lee', email: 'david@example.com', amount: 33.40, currency: 'EUR', status: 'Completed', paymentMethod: 'Payment by Stripe', description: 'Online order', createdAt: '2025-10-25T11:00:00Z', updatedAt: '2025-10-25T11:00:00Z' },
  { id: '7', transactionId: '#TRX-8827', date: '2025-10-24', userName: 'Lisa Anderson', email: 'lisa@example.com', amount: 67.80, currency: 'EUR', status: 'Completed', paymentMethod: 'COFFECITO Wallet', description: 'Catering order', createdAt: '2025-10-24T13:30:00Z', updatedAt: '2025-10-24T13:30:00Z' },
  { id: '8', transactionId: '#TRX-8828', date: '2025-10-24', userName: 'Robert Taylor', email: 'robert@example.com', amount: 22.99, currency: 'EUR', status: 'Pending', paymentMethod: 'Payment by Stripe', description: 'Merchandise', createdAt: '2025-10-24T15:00:00Z', updatedAt: '2025-10-24T15:00:00Z' },
  { id: '9', transactionId: '#TRX-8829', date: '2025-10-23', userName: 'Jennifer White', email: 'jennifer@example.com', amount: 45.25, currency: 'EUR', status: 'Completed', paymentMethod: 'Digital Gift Card', description: 'Gift card use', createdAt: '2025-10-23T08:45:00Z', updatedAt: '2025-10-23T08:45:00Z' },
  { id: '10', transactionId: '#TRX-8830', date: '2025-10-23', userName: 'James Wilson', email: 'james@example.com', amount: 18.50, currency: 'EUR', status: 'Completed', paymentMethod: 'COFFECITO Wallet', description: 'Cafe order', createdAt: '2025-10-23T12:00:00Z', updatedAt: '2025-10-23T12:00:00Z' },
  { id: '11', transactionId: '#TRX-8831', date: '2025-10-22', userName: 'Maria Garcia', email: 'maria@example.com', amount: 99.00, currency: 'EUR', status: 'Pending', paymentMethod: 'Payment by Stripe', description: 'Bulk order', createdAt: '2025-10-22T10:30:00Z', updatedAt: '2025-10-22T10:30:00Z' },
  { id: '12', transactionId: '#TRX-8832', date: '2025-10-22', userName: 'Thomas Clark', email: 'thomas@example.com', amount: 28.75, currency: 'EUR', status: 'Completed', paymentMethod: 'COFFECITO Wallet', description: 'Coffee subscription', createdAt: '2025-10-22T14:15:00Z', updatedAt: '2025-10-22T14:15:00Z' },
  { id: '13', transactionId: '#TRX-8833', date: '2025-10-21', userName: 'Emily Martinez', email: 'emily@example.com', amount: 55.20, currency: 'EUR', status: 'Completed', paymentMethod: 'Digital Gift Card', description: 'Gift redemption', createdAt: '2025-10-21T11:45:00Z', updatedAt: '2025-10-21T11:45:00Z' },
  { id: '14', transactionId: '#TRX-8834', date: '2025-10-21', userName: 'Daniel Wright', email: 'daniel@example.com', amount: 42.00, currency: 'EUR', status: 'Completed', paymentMethod: 'Payment by Stripe', description: 'Online payment', createdAt: '2025-10-21T16:00:00Z', updatedAt: '2025-10-21T16:00:00Z' },
  { id: '15', transactionId: '#TRX-8835', date: '2025-10-20', userName: 'Olivia Harris', email: 'olivia@example.com', amount: 75.50, currency: 'EUR', status: 'Pending', paymentMethod: 'COFFECITO Wallet', description: 'Event booking', createdAt: '2025-10-20T09:00:00Z', updatedAt: '2025-10-20T09:00:00Z' },
]

interface TransactionState {
  list: Transaction[]
  filteredList: Transaction[]
  filters: TransactionFilters
  pagination: PaginationState
  isLoading: boolean
  error: string | null
}

const initialState: TransactionState = {
  list: mockTransactions,
  filteredList: mockTransactions,
  filters: {
    search: '',
    status: 'all',
  },
  pagination: {
    ...DEFAULT_PAGINATION,
    total: mockTransactions.length,
    totalPages: Math.ceil(mockTransactions.length / DEFAULT_PAGINATION.limit),
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

