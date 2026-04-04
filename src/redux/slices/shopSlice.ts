import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Shop } from '@/types'

interface ShopState {
  list: Shop[]
  filteredList: Shop[]
}

const initialState: ShopState = {
  list: [],
  filteredList: [],
}

const shopSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {
    setShops: (state, action: PayloadAction<Shop[]>) => {
      state.list = action.payload
      state.filteredList = action.payload
    },
    addShop: (state, action: PayloadAction<Shop>) => {
      state.list.unshift(action.payload)
      state.filteredList.unshift(action.payload)
    },
    updateShop: (state, action: PayloadAction<Shop>) => {
      const index = state.list.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
      const fi = state.filteredList.findIndex((s) => s.id === action.payload.id)
      if (fi !== -1) {
        state.filteredList[fi] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
    },
    deleteShop: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((s) => s.id !== action.payload)
      state.filteredList = state.filteredList.filter((s) => s.id !== action.payload)
    },
    toggleShopStatus: (state, action: PayloadAction<string>) => {
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
  setShops,
  addShop,
  updateShop,
  deleteShop,
  toggleShopStatus,
} = shopSlice.actions
export default shopSlice.reducer
