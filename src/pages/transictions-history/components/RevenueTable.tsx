import { Wallet, Gift, CreditCard, Check, RotateCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import type { RevenueRecord } from '@/redux/packageTypes/revenue'
import { formatDate, formatTime, formatCurrency } from '@/utils/formatters'

interface RevenueTableProps {
  items: RevenueRecord[]
}

function formatPaymentMethodLabel(method: string) {
  if (!method) return 'N/A'
  return method
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function paymentStatusBadgeClass(status: string) {
  const s = status.toLowerCase()
  if (s === 'paid' || s === 'completed' || s === 'success') {
    return 'bg-green-600'
  }
  if (s === 'pending' || s === 'processing') {
    return 'bg-amber-500'
  }
  if (s === 'failed' || s === 'cancelled' || s === 'canceled' || s === 'refunded') {
    return 'bg-red-500'
  }
  return 'bg-gray-500'
}

function PaymentMethodIcon({ method }: { method: string }) {
  const methodLower = method.toLowerCase()
  if (methodLower.includes('wallet') || methodLower.includes('coffecito')) {
    return <Wallet className="h-4 w-4 text-muted-foreground" />
  }
  if (methodLower.includes('gift')) {
    return <Gift className="h-4 w-4 text-muted-foreground" />
  }
  return <CreditCard className="h-4 w-4 text-muted-foreground" />
}

export function RevenueTable({ items }: RevenueTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
            <th className="px-6 py-4 text-left text-sm font-bold">
              Date & Time
            </th>
            <th className="px-6 py-4 text-right text-sm font-bold">Amount</th>
            <th className="px-6 py-4 text-left text-sm font-bold">
              Payment Method
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                No revenue records found
              </td>
            </tr>
          ) : (
            items.map((row, index) => {
              const statusLabel = formatPaymentMethodLabel(row.paymentStatus)
              const isPaidLike = ['paid', 'completed', 'success'].includes(
                row.paymentStatus.toLowerCase()
              )
              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * index }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-800">
                      {row.orderId}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-700">
                        {formatDate(row.createdAt, 'dd MMM yyyy')}
                      </span>
                      <span className="inline-flex w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {formatTime(row.createdAt)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-slate-800">
                      {formatCurrency(row.totalAmount, 'EUR')}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <PaymentMethodIcon method={row.paymentMethod || ''} />
                      <span className="text-sm text-slate-700">
                        {formatPaymentMethodLabel(row.paymentMethod)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-3 rounded-sm w-28 text-xs font-medium text-white',
                        paymentStatusBadgeClass(row.paymentStatus)
                      )}
                    >
                      {isPaidLike ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <RotateCw className="h-4 w-4" />
                      )}
                      {statusLabel}
                    </span>
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
