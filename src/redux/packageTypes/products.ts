import type { Pagination } from './category'

export interface ApiProductStoreRef {
  _id: string
  name: string
}

export interface ApiProductCustomizationOption {
  _id: string
  label: string
  price: number
}

export interface ApiProductCustomization {
  _id: string
  name: string
  type: string
  isRequired: boolean
  options: ApiProductCustomizationOption[]
  pricePerUnit?: number
}

export interface ApiProduct {
  _id: string
  store: ApiProductStoreRef
  name: string
  description: string
  image: string
  category: string
  basePrice: number
  customizations: ApiProductCustomization[]
  dietaryLabels: string[]
  readyTime: number
  isActive: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface GetProductsApiResponse {
  success: boolean
  message: string
  pagination: Pagination
  data: ApiProduct[]
}

export interface ProductListResult {
  items: ApiProduct[]
  pagination: Pagination
}

export type GetProductsArgs = {
  page: number
  limit: number
  search?: string
}

/** JSON inside FormData `data` field for POST/PATCH `/products` */
export interface ProductFormDataPayload {
  store: string
  category: string
  name: string
  description: string
  basePrice: number
  readyTime: number
  isActive: boolean
  dietaryLabels: string[]
  customizationIds: string[]
}

export type CreateProductArgs = {
  data: ProductFormDataPayload
  image: File
}

export type UpdateProductArgs = {
  id: string
  data: ProductFormDataPayload
  image?: File | null
}
