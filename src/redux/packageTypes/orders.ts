/** Admin orders API — matches `/admin/orders` list item shape */

export type ApiOrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | string

export interface OrderStatusLogEntry {
  status: string
  timestamp: string
  _id: string
}

export interface OrderItemCustomization {
  customizationId: string
  name: string
  optionId?: string
  optionLabel?: string
  optionPrice?: number
  totalPrice?: number
  quantity?: number
  pricePerUnit?: number
}

export interface AdminOrderItem {
  product: string
  productName: string
  basePrice: number
  quantity: number
  selectedCustomizations: OrderItemCustomization[]
  unitFinalPrice: number
  itemTotalPrice: number
}

export interface AdminOrderStoreRef {
  _id: string
  name?: string
  address?: string
}

export interface AdminOrderCustomerRef {
  _id: string
  name?: string
  email?: string
  phone?: string
  address?: string
}

export interface AdminOrder {
  _id: string
  store: AdminOrderStoreRef

  customer: AdminOrderCustomerRef
  orderId: string
  items: AdminOrderItem[]
  subtotal: number
  taxAmount: number
  tipAmount: number
  discountAmount: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: ApiOrderStatus
  pointsEarned: number
  loyaltyPointsUsed: number
  paymentId: string
  stripeFee: number
  statusLogs: OrderStatusLogEntry[]
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface OrdersPagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface GetOrdersApiResponse {
  success: boolean
  message: string
  pagination: OrdersPagination
  data: AdminOrder[]
}

export interface OrdersListResult {
  orders: AdminOrder[]
  pagination: OrdersPagination
}

export const ORDER_STATUS_UPDATE_OPTIONS: {
  value: ApiOrderStatus
  label: string
}[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]
