import { motion } from 'framer-motion'
import { Check, Coffee, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { OrderActionButtons } from './OrderActionButtons'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import type { AdminOrder } from '@/redux/packageTypes/orders'

interface OrderTableProps {
  orders: AdminOrder[]
  startIndex: number
  onView: (order: AdminOrder) => void
  onUpdateStatus: (order: AdminOrder) => void
}

function statusUi(status: string) {
  const key = (status || '').toLowerCase()
  const map: Record<
    string,
    { bg: string; icon: typeof Check; label: string }
  > = {
    completed: {
      bg: 'bg-green-500',
      icon: Check,
      label: 'Completed',
    },
    processing: {
      bg: 'bg-blue-500',
      icon: Check,
      label: 'Processing',
    },
    ready: {
      bg: 'bg-teal-500',
      icon: Coffee,
      label: 'Ready',
    },
    pending: {
      bg: 'bg-amber-500',
      icon: Check,
      label: 'Pending',
    },
    cancelled: {
      bg: 'bg-red-500',
      icon: X,
      label: 'Cancelled',
    },
  }
  return (
    map[key] ?? {
      bg: 'bg-gray-500',
      icon: Check,
      label: status || '—',
    }
  )
}

function lineItemSummary(order: AdminOrder): string {
  if (!order.items?.length) return '—'
  return order.items.map((i) => i.productName).join(', ')
}

function itemQtyTotal(order: AdminOrder): number {
  return order.items.reduce((sum, i) => sum + (i.quantity ?? 0), 0)
}

export function OrderTable({
  orders,
  startIndex,
  onView,
  onUpdateStatus,
}: OrderTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">S.N</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Preview</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Order</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Date & Time</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Qty</th>
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
              const created = parseISO(order.createdAt)
              const config = statusUi(String(order.orderStatus))
              const StatusIcon = config.icon
              return (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-2">
                    <span className="text-sm text-slate-700">
                      {String(startIndex + index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
                      <Coffee className="h-6 w-6 text-amber-800/70" />
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <div className="flex flex-col max-w-[220px]">
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        {lineItemSummary(order)}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {order.orderId}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700">
                        {format(created, 'dd MMM yyyy')}
                      </span>
                      <span
                        className={cn(
                          'text-xs inline-flex w-fit px-2 py-0.5 rounded-full bg-gray-100 text-gray-600'
                        )}
                      >
                        {format(created, 'h:mm a')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <span className="text-sm text-slate-700">
                      {itemQtyTotal(order)} items
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <span className="text-sm font-medium text-slate-700">
                      {formatCurrency(order.totalAmount)}
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
                      onUpdateStatus={onUpdateStatus}
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
