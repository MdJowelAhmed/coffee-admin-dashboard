import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Shop } from '@/types'

interface ShopState {
  list: Shop[]
  filteredList: Shop[]
}

const mockShops: Shop[] = [
  { id: 'sh1', shopName: 'Starbucks', contact: '+1664456285966', location: '17 Motijheel C/A, Dhaka 1000', openTime: '07:00', closeTime: '22:00', offDay: 'Friday', aboutShop: 'Premium coffee and espresso drinks. Prepared with quality beans, fresh milk options, and custom syrups.', shopPicture: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sh2', shopName: 'Coffee World', contact: '+8801712345678', location: 'Dhanmondi 27, Dhaka', openTime: '08:00', closeTime: '23:00', offDay: 'Saturday', aboutShop: 'Cozy café serving specialty coffee and light bites in a warm atmosphere.', shopPicture: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sh3', shopName: 'North End Coffee', contact: '+8801812345678', location: 'Gulshan 2, Dhaka', openTime: '06:30', closeTime: '21:30', aboutShop: 'Artisan roasters with single-origin beans and house-made pastries.', shopPicture: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sh4', shopName: 'Bunka Coffee', contact: '+8801912345678', location: 'Banani, Dhaka', openTime: '09:00', closeTime: '20:00', aboutShop: 'Japanese-inspired coffee house with pour-over and matcha options.', shopPicture: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400', isActive: false, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sh5', shopName: 'Coffeelicious', contact: '+8801612345678', location: 'Uttara Sector 7, Dhaka', openTime: '07:30', closeTime: '22:30', aboutShop: 'Family-friendly café with free WiFi and a wide variety of drinks.', shopPicture: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sh6', shopName: 'The Daily Grind', contact: '+8801512345678', location: 'Mirpur 10, Dhaka', openTime: '08:00', closeTime: '21:00', aboutShop: 'Quick service coffee shop for busy mornings and afternoon breaks.', shopPicture: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sh7', shopName: 'Bean There', contact: '+8801412345678', location: 'Bashundhara, Dhaka', openTime: '07:00', closeTime: '23:00', aboutShop: 'Premium beans roasted in-house. Cold brew and nitro on tap.', shopPicture: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'sh8', shopName: 'Mocha House', contact: '+8801312345678', location: 'Shyamoli, Dhaka', openTime: '09:00', closeTime: '22:00', aboutShop: 'Dessert-focused café with rich mochas, cakes, and waffles.', shopPicture: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', isActive: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
]

const initialState: ShopState = {
  list: mockShops,
  filteredList: mockShops,
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
