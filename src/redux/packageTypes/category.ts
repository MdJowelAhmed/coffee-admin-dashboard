export type CategoryDto = {
  _id: string
  name: string
  isActive: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
}

export type Category = {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type Pagination = {
  total: number
  limit: number
  page: number
  totalPage: number
}

export type GetCategoriesApiResponse = {
  success: boolean
  message: string
  pagination: Pagination
  data: CategoryDto[]
}

export type CategoryListResult = {
  items: Category[]
  pagination: Pagination
}

export type GetCategoriesArgs = {
  page: number
  limit: number
  search?: string
}

export type CreateCategoryBody = {
  name: string
}

export type UpdateCategoryBody = {
  id: string
  name?: string
  isActive?: boolean
}

