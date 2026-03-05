import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ShopCategory } from '@/types'

interface ShopCategoryState {
  list: ShopCategory[]
  filteredList: ShopCategory[]
}

const mockShopCategories: ShopCategory[] = [
  { id: 'sc1', name: 'Hot Coffee', shortDescription: 'Classic hot brewed coffees and espresso drinks.', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc2', name: 'Cold Coffee', shortDescription: 'Iced coffees, cold brew, and frappuccinos.', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc3', name: 'Tea', shortDescription: 'Green tea, black tea, chai, and herbal blends.', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc4', name: 'Pastries', shortDescription: 'Croissants, muffins, cakes, and cookies.', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc5', name: 'Sandwiches', shortDescription: 'Breakfast and lunch sandwiches, paninis.', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc6', name: 'Smoothies', shortDescription: 'Fresh fruit smoothies and protein shakes.', isActive: false, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc7', name: 'Snacks', shortDescription: 'Chips, nuts, energy bars, and light bites.', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sc8', name: 'Seasonal', shortDescription: 'Limited-time seasonal offerings.', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
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
