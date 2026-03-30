import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { SyrupType } from '@/types'

interface SyrupTypeState {
  list: SyrupType[]
  filteredList: SyrupType[]
}

const initialState: SyrupTypeState = {
  list: [],
  filteredList: [],
}

const syrupTypeSlice = createSlice({
  name: 'syrupTypes',
  initialState,
  reducers: {
    setSyrupTypes: (state, action: PayloadAction<SyrupType[]>) => {
      state.list = action.payload
      state.filteredList = action.payload
    },
    addSyrupType: (state, action: PayloadAction<SyrupType>) => {
      state.list.unshift(action.payload)
      state.filteredList.unshift(action.payload)
    },
    updateSyrupType: (state, action: PayloadAction<SyrupType>) => {
      const index = state.list.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
      const fi = state.filteredList.findIndex((s) => s.id === action.payload.id)
      if (fi !== -1) {
        state.filteredList[fi] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
    },
    deleteSyrupType: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((s) => s.id !== action.payload)
      state.filteredList = state.filteredList.filter((s) => s.id !== action.payload)
    },
    toggleSyrupTypeStatus: (state, action: PayloadAction<string>) => {
      const item = state.list.find((s) => s.id === action.payload)
      if (item) {
        item.isActive = !item.isActive
        item.updatedAt = new Date().toISOString()
      }
      const fItem = state.filteredList.find((s) => s.id === action.payload)
      if (fItem) {
        fItem.isActive = !fItem.isActive
        fItem.updatedAt = new Date().toISOString()
      }
    },
  },
})

export const {
  setSyrupTypes,
  addSyrupType,
  updateSyrupType,
  deleteSyrupType,
  toggleSyrupTypeStatus,
} = syrupTypeSlice.actions
export default syrupTypeSlice.reducer
