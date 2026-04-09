import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Controller } from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'
import type { Pagination } from '@/redux/packageTypes/revenue'
import type { ControllerListResult } from '@/redux/packageTypes/controllers'

interface ControllerState {
  list: Controller[]
  filteredList: Controller[]
  pagination: Pagination
}

const initialState: ControllerState = {
  list: [],
  filteredList: [],
  pagination: {
    ...DEFAULT_PAGINATION,
    total: 0,
    totalPage: 0,
  },
}

const controllerSlice = createSlice({
  name: 'controllers',
  initialState,
  reducers: {
    setControllers: (state, action: PayloadAction<ControllerListResult>) => {
      state.list = action.payload.items
      state.filteredList = action.payload.items
      state.pagination = action.payload.pagination
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
    },
  },
})

export const { setControllers, setPage, setLimit } = controllerSlice.actions
export default controllerSlice.reducer
