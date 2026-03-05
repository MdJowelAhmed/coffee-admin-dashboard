import { ModalWrapper } from '@/components/common'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import type { Order, OrderStatus } from '@/types'

interface ViewOrderDetailsModalProps {
  open: boolean
  onClose: () => void
  order: Order | null
}

const statusConfig: Record<OrderStatus, { bg: string; label: string }> = {
  Completed: { bg: 'bg-green-500', label: 'Completed' },
  Processing: { bg: 'bg-blue-500', label: 'Processing' },
  Cancelled: { bg: 'bg-red-500', label: 'Cancelled' },
}

export function ViewOrderDetailsModal({
  open,
  onClose,
  order,
}: ViewOrderDetailsModalProps) {
  if (!order) return null

  const config = statusConfig[order.status]

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Transaction Details"
      size="lg"
      className="max-w-lg bg-white"
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="flex gap-4">
          <img
            src={order.image}
            alt={order.title}
            className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/80?text=Coffee'
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-800">{order.title}</h3>
            <p className="text-sm text-gray-500">{order.vendor}</p>
            <p className="text-sm text-gray-600 mt-1">
              {order.date} - {order.time}
            </p>
            {order.pickupTime && (
              <p className="text-sm text-gray-600">
                Pickup Time: {order.pickupTime}
              </p>
            )}
            <span
              className={cn(
                'inline-flex mt-2 px-2.5 py-1 rounded text-xs font-medium text-white',
                config.bg
              )}
            >
              {config.label}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800">
              {formatCurrency(order.totalPrice ?? order.amount)}
            </p>
          </div>
        </div>

        {/* Transaction Details */}
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-3">
            Transaction Details
          </h4>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
            {order.transactionId && (
              <DetailRow
                label="Transaction ID"
                value={order.transactionId}
              />
            )}
            {order.location && (
              <DetailRow label="Location" value={order.location} />
            )}
            <DetailRow label="Item Number" value={String(order.itemCount)} />
            {order.customizeItem && (
              <DetailRow label="Customize Item" value={order.customizeItem} />
            )}
            {order.previousBalance != null && (
              <DetailRow
                label="Previous Balance"
                value={formatCurrency(order.previousBalance)}
              />
            )}
            {order.orderPrice != null && (
              <DetailRow
                label="Order Price"
                value={formatCurrency(order.orderPrice)}
              />
            )}
            {order.newBalance != null && (
              <DetailRow
                label="New Balance"
                value={formatCurrency(order.newBalance)}
              />
            )}
            {order.tips != null && order.tips > 0 && (
              <DetailRow label="Tips" value={formatCurrency(order.tips)} />
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  )
}
