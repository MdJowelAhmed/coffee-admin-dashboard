import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { OrderActionButtons } from './OrderActionButtons'
import { cn } from '@/utils/cn'
import type { Order, OrderStatus } from '@/types'
import { formatCurrency } from '@/utils/formatters'

interface OrderTableProps {
  orders: Order[]
  onView: (order: Order) => void
  onDelete: (order: Order) => void
}

const statusConfig: Record<
  OrderStatus,
  { bg: string; icon: React.ElementType; label: string }
> = {
  Completed: {
    bg: 'bg-green-500',
    icon: Check,
    label: 'Completed',
  },
  Processing: {
    bg: 'bg-blue-500',
    icon: Check,
    label: 'Processing',
  },
  Cancelled: {
    bg: 'bg-red-500',
    icon: X,
    label: 'Cancelled',
  },
}

export function OrderTable({ orders, onView, onDelete }: OrderTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">S.N</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Items</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Title</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Date & Time</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Item Number</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order, index) => {
              const config = statusConfig[order.status]
              const StatusIcon = config.icon
              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-2">
                    <span className="text-sm text-slate-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/48?text=Coffee'
                      }}
                    />
                  </td>
                  <td className="px-6 py-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800">
                        {order.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.orderId}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700">
                        {order.date}
                      </span>
                      <span
                        className={cn(
                          'text-xs inline-flex w-fit px-2 py-0.5 rounded-full bg-gray-100 text-gray-600'
                        )}
                      >
                        {order.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <span className="text-sm text-slate-700">
                      {order.itemCount} Items
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <span className="text-sm font-medium text-slate-700">
                      {formatCurrency(order.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-3 rounded-sm w-28 text-xs font-medium text-white',
                        config.bg
                      )}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <OrderActionButtons
                      order={order}
                      onView={onView}
                      onDelete={onDelete}
                    />
                  </td>
                </motion.tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
