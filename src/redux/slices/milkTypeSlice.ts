import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { MilkType } from '@/types'

interface MilkTypeState {
  list: MilkType[]
  filteredList: MilkType[]
}

const initialState: MilkTypeState = {
  list: [],
  filteredList: [],
}

const milkTypeSlice = createSlice({
  name: 'milkTypes',
  initialState,
  reducers: {
    setMilkTypes: (state, action: PayloadAction<MilkType[]>) => {
      state.list = action.payload
      state.filteredList = action.payload
    },
    addMilkType: (state, action: PayloadAction<MilkType>) => {
      state.list.unshift(action.payload)
      state.filteredList.unshift(action.payload)
    },
    updateMilkType: (state, action: PayloadAction<MilkType>) => {
      const index = state.list.findIndex((m) => m.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
      const fi = state.filteredList.findIndex((m) => m.id === action.payload.id)
      if (fi !== -1) {
        state.filteredList[fi] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
    },
    deleteMilkType: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((m) => m.id !== action.payload)
      state.filteredList = state.filteredList.filter((m) => m.id !== action.payload)
    },
    toggleMilkTypeStatus: (state, action: PayloadAction<string>) => {
      const item = state.list.find((m) => m.id === action.payload)
      if (item) {
        item.isActive = !item.isActive
        item.updatedAt = new Date().toISOString()
      }
      const fItem = state.filteredList.find((m) => m.id === action.payload)
      if (fItem) {
        fItem.isActive = !fItem.isActive
        fItem.updatedAt = new Date().toISOString()
      }
    },
  },
})

export const {
  setMilkTypes,
  addMilkType,
  updateMilkType,
  deleteMilkType,
  toggleMilkTypeStatus,
} = milkTypeSlice.actions
export default milkTypeSlice.reducer
