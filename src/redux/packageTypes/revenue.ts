export type RevenueDto = {
  _id: string
  orderId: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  createdAt: string
}

export type RevenueRecord = {
  id: string
  orderId: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  createdAt: string
}

export type Pagination = {
  total: number
  limit: number
  page: number
  totalPage: number
}

export type GetRevenueApiResponse = {
  success: boolean
  message: string
  pagination: Pagination
  data: RevenueDto[]
}

export type RevenueListResult = {
  items: RevenueRecord[]
  pagination: Pagination
}

export type GetRevenueArgs = {
  page: number
  limit: number
  search?: string
}
