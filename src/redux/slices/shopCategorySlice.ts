import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ShopCategory } from '@/types'

interface ShopCategoryState {
  list: ShopCategory[]
  filteredList: ShopCategory[]
}

const mockShopCategories: ShopCategory[] = [
  { id: 'sc1', name: 'Hot Coffee', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc2', name: 'Cold Coffee', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc3', name: 'Tea', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc4', name: 'Pastries', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc5', name: 'Sandwiches', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc6', name: 'Smoothies', isActive: false, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc7', name: 'Snacks', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc8', name: 'Seasonal', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
]

const initialState: ShopCategoryState = {
  list: mockShopCategories,
  filteredList: mockShopCategories,
}

const shopCategorySlice = createSlice({
  name: 'shopCategories',
  initialState,
  reducers: {
    setShopCategories: (state, action: PayloadAction<ShopCategory[]>) => {
      state.list = action.payload
      state.filteredList = action.payload
    },
    addShopCategory: (state, action: PayloadAction<ShopCategory>) => {
      state.list.unshift(action.payload)
      state.filteredList.unshift(action.payload)
    },
    updateShopCategory: (state, action: PayloadAction<ShopCategory>) => {
      const index = state.list.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
      const fi = state.filteredList.findIndex((c) => c.id === action.payload.id)
      if (fi !== -1) {
        state.filteredList[fi] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
    },
    deleteShopCategory: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((c) => c.id !== action.payload)
      state.filteredList = state.filteredList.filter((c) => c.id !== action.payload)
    },
    toggleShopCategoryStatus: (state, action: PayloadAction<string>) => {
      const item = state.list.find((c) => c.id === action.payload)
      if (item) {
        item.isActive = !item.isActive
        item.updatedAt = new Date().toISOString()
      }
      const fItem = state.filteredList.find((c) => c.id === action.payload)
      if (fItem) {
        fItem.isActive = !fItem.isActive
        fItem.updatedAt = new Date().toISOString()
      }
    },
  },
})

export const {
  setShopCategories,
  addShopCategory,
  updateShopCategory,
  deleteShopCategory,
  toggleShopCategoryStatus,
} = shopCategorySlice.actions
export default shopCategorySlice.reducer
