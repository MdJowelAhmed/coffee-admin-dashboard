export type CustomizeType = 'milk' | 'syrup'

export interface CustomizePagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

/** API shape for `/customize` items */
export interface ApiCustomizeItem {
  _id: string
  name: string
  price: number
  type: CustomizeType | string
  status: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface GetCustomizeApiResponse {
  success: boolean
  message: string
  pagination: CustomizePagination
  data: ApiCustomizeItem[]
}

export interface CustomizeListResult {
  items: ApiCustomizeItem[]
  pagination: CustomizePagination
}

export interface CreateCustomizeBody {
  name: string
  price: number
  type: CustomizeType
}

export interface UpdateCustomizeBody {
  id: string
  name?: string
  price?: number
  type?: CustomizeType
  status?: boolean
}

export interface CustomizeMutationResponse {
  success: boolean
  message: string
  data: ApiCustomizeItem
}

