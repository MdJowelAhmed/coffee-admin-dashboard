/** Summary cards: GET /analytics/summary-cards */
export interface DashboardSummaryCards {
  totalOrders: number
  totalSales: number
  newCustomersLast30Days: number
  totalGrossRevenue: number
}

/** Gross revenue by month: GET /analytics/gross-revenue-by-month?year= */
export interface RevenueByMonthItem {
  month: string
  revenue: number
  year: number
}

/** Orders by category: GET /analytics/orders-by-category?range=week|month|year */
export interface OrderByCategoryItem {
  categoryName?: string
  category?: string
  name?: string
  _id?: string
  orders?: number
  count?: number
  value?: number
  totalOrders?: number
}

export type OrdersByCategoryRange = 'week' | 'month' | 'year'

/** Recent orders: GET /analytics/recent-orders */
export interface RecentOrderCustomer {
  _id: string
  name?: string
  email?: string
  profileImage?: string
  phone?: string
}

export interface RecentOrderStore {
  _id: string
  name?: string
}

export interface RecentOrderLineItem {
  product?: string
  productName?: string
  quantity?: number
}

export interface DashboardRecentOrder {
  _id: string
  store?: RecentOrderStore
  customer?: RecentOrderCustomer
  orderId: string
  items: RecentOrderLineItem[]
  totalAmount: number
  orderStatus: string
  paymentStatus?: string
  createdAt: string
}

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export type GetStatisticsResponse = ApiEnvelope<DashboardSummaryCards>
export type GetRevenueSummaryResponse = ApiEnvelope<RevenueByMonthItem[]>
export type GetOrderSummaryResponse = ApiEnvelope<OrderByCategoryItem[]>
export type GetRecentActivityResponse = ApiEnvelope<DashboardRecentOrder[]>
