import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Controller } from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

interface ControllerState {
  list: Controller[]
  filteredList: Controller[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const mockControllers: Controller[] = [
  {
    id: 'ctrl-1',
    name: 'Admin Controller',
    email: 'admin@example.com',
    phone: '+8801712345678',
    role: 'admin',
    shopId: 'sh1',
    shopName: 'Starbucks',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'ctrl-2',
    name: 'Marketing Controller',
    email: 'marketing@example.com',
    phone: '+8801812345679',
    role: 'marketing',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
]

const initialState: ControllerState = {
  list: mockControllers,
  filteredList: mockControllers,
  pagination: {
    ...DEFAULT_PAGINATION,
    total: mockControllers.length,
    totalPages: Math.ceil(mockControllers.length / DEFAULT_PAGINATION.limit),
  },
}

const controllerSlice = createSlice({
  name: 'controllers',
  initialState,
  reducers: {
    addController: (state, action: PayloadAction<Controller>) => {
      state.list.unshift(action.payload)
      state.filteredList.unshift(action.payload)
      state.pagination.total = state.filteredList.length
      state.pagination.totalPages = Math.ceil(
        state.filteredList.length / state.pagination.limit
      )
    },
    setControllers: (state, action: PayloadAction<Controller[]>) => {
      state.list = action.payload
      state.filteredList = action.payload
      state.pagination.total = action.payload.length
      state.pagination.totalPages = Math.ceil(
        action.payload.length / state.pagination.limit
      )
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

export const { addController, setControllers, setPage, setLimit } =
  controllerSlice.actions
export default controllerSlice.reducer
