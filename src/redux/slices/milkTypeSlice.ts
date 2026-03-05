import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { MilkType } from '@/types'

interface MilkTypeState {
  list: MilkType[]
  filteredList: MilkType[]
}

const mockMilkTypes: MilkType[] = [
  { id: 'm1', name: 'Whole Milk', price: 0.50, type: 'milk', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'm2', name: 'Oat Milk', price: 0.75, type: 'milk', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'm3', name: 'Almond Milk', price: 0.80, type: 'milk', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'm4', name: 'Soy Milk', price: 0.65, type: 'milk', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'm5', name: 'Skim Milk', price: 0.45, type: 'milk', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'm6', name: 'Coconut Milk', price: 0.90, type: 'milk', isActive: false, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'm7', name: 'Lactose-Free Milk', price: 0.85, type: 'milk', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'm8', name: 'Cream', price: 1.00, type: 'milk', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
]

const initialState: MilkTypeState = {
  list: mockMilkTypes,
  filteredList: mockMilkTypes,
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
