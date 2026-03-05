import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Poster, PaginationState } from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

interface AdState {
  list: Poster[]
  pagination: PaginationState
}

const initialState: AdState = {
  list: [],
  pagination: {
    ...DEFAULT_PAGINATION,
    total: 0,
    totalPages: 0,
  },
}

const adSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    addPoster: (state, action: PayloadAction<Poster>) => {
      state.list.unshift(action.payload)
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.ceil(
        state.list.length / state.pagination.limit
      )
    },
    deletePoster: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((p) => p.id !== action.payload)
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.max(
        0,
        Math.ceil(state.list.length / state.pagination.limit)
      )
      if (state.pagination.page > state.pagination.totalPages && state.pagination.totalPages > 0) {
        state.pagination.page = state.pagination.totalPages
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.totalPages = Math.ceil(
        state.list.length / action.payload
      )
      state.pagination.page = 1
    },
  },
})

export const { addPoster, deletePoster, setPage, setLimit } = adSlice.actions
export default adSlice.reducer
