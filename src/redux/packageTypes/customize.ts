export type CustomizationSelectionMode = 'single' | 'multi' | 'quantity'

export interface CustomizePagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface ApiCustomizeOption {
  _id: string
  label: string
  price: number
}

/** One customization group from `/customizationOptions` (tab = one item) */
export interface ApiCustomizeItem {
  _id: string
  name: string
  type: CustomizationSelectionMode | string
  isRequired: boolean
  status: boolean
  isDeleted?: boolean
  options: ApiCustomizeOption[]
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
  type: CustomizationSelectionMode
  isRequired: boolean
}

export interface UpdateCustomizeBody {
  id: string
  name?: string
  type?: CustomizationSelectionMode
  isRequired?: boolean
  status?: boolean
}

export interface CreateCustomizeOptionBody {
  id: string
  label: string
  price: number
}

export interface UpdateCustomizeOptionBody {
  id: string
  optionId: string
  label: string
  price: number
}

export interface CustomizeMutationResponse {
  success: boolean
  message: string
  data: ApiCustomizeItem
}
