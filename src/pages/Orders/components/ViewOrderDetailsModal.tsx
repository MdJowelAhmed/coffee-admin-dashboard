import { format, parseISO } from 'date-fns'
import { ModalWrapper } from '@/components/common'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import type {
  AdminOrder,
  OrderItemCustomization,
} from '@/redux/packageTypes/orders'

interface ViewOrderDetailsModalProps {
  open: boolean
  onClose: () => void
  order: AdminOrder | null
}

function statusBadge(status: string) {
  const key = (status || '').toLowerCase()
  const map: Record<string, string> = {
    completed: 'bg-green-500',
    processing: 'bg-blue-500',
    pending: 'bg-amber-500',
    cancelled: 'bg-red-500',
  }
  return map[key] ?? 'bg-gray-500'
}

function formatCustomization(c: OrderItemCustomization): string {
  const bits: string[] = [c.name]
  if (c.optionLabel) bits.push(c.optionLabel)
  if (c.quantity != null && c.quantity > 0)
    bits.push(`qty ${c.quantity}`)
  if (c.pricePerUnit != null)
    bits.push(`${formatCurrency(c.pricePerUnit)} / unit`)
  if (c.optionPrice != null && c.totalPrice != null)
    bits.push(`add-on ${formatCurrency(c.optionPrice)}`)
  return bits.join(' · ')
}

function formatPaymentMethod(method: string): string {
  return method
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function ViewOrderDetailsModal({
  open,
  onClose,
  order,
}: ViewOrderDetailsModalProps) {
  if (!order) return null

  const created = parseISO(order.createdAt)
  const statusKey = String(order.orderStatus ?? '')



  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Order details"
      size="lg"
      className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{order.orderId}</h3>
            <p className="text-sm text-gray-500">
              {format(created, 'dd MMM yyyy · h:mm a')}
            </p>
            <span
              className={cn(
                'inline-flex mt-2 px-2.5 py-1 rounded text-xs font-medium text-white capitalize',
                statusBadge(statusKey)
              )}
            >
              {statusKey || '—'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Total
            </p>
            <p className="text-2xl font-bold text-slate-800">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-2">Items</h4>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
            {order.items.map((line, idx) => (
              <div key={idx} className="px-4 py-3 space-y-2">
                <div className="flex justify-between gap-4">
                  <span className="text-sm font-medium text-slate-800">
                    {line.productName}{' '}
                    <span className="text-gray-500 font-normal">
                      ×{line.quantity}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-slate-800 shrink-0">
                    {formatCurrency(line.itemTotalPrice)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Base {formatCurrency(line.basePrice)} · Unit{' '}
                  {formatCurrency(line.unitFinalPrice)}
                </p>
                {line.selectedCustomizations?.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-1 pl-3 list-disc">
                    {line.selectedCustomizations.map((c, i) => (
                      <li key={c.customizationId + i}>
                        {formatCustomization(c)}
                        {c.totalPrice != null && c.totalPrice > 0 && (
                          <span className="text-slate-700">
                            {' '}
                            (+{formatCurrency(c.totalPrice)})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-3">Totals</h4>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
            <DetailRow label="Subtotal" value={formatCurrency(order.subtotal)} />
            <DetailRow label="Tax" value={`+${formatCurrency(order.taxAmount)}`} />
            <DetailRow label="Tip" value={`+${formatCurrency(order.tipAmount)}`} />
            <DetailRow
              label="Discount"
              value={`-${formatCurrency(order.discountAmount)}`}
            />
            {/* <DetailRow
              label="Stripe fee"
              value={formatCurrency(order.stripeFee)}
            /> */}
            <DetailRow
              label="Total"
              value={formatCurrency(order.totalAmount)}
              emphasize
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-3">Payment</h4>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
            <DetailRow
              label="Method"
              value={formatPaymentMethod(order.paymentMethod)}
            />
            <DetailRow
              label="Payment status"
              value={order.paymentStatus}
              capitalize
            />
            {order.paymentId ? (
              <DetailRow label="Payment ID" value={order.paymentId} />
            ) : null}
            <DetailRow
              label="Points earned"
              value={String(order.pointsEarned ?? 0)}
            />
            <DetailRow
              label="Loyalty points used"
              value={String(order.loyaltyPointsUsed ?? 0)}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-3">References</h4>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
           
            <DetailRow label="Store Name" value={order.store.name || 'N/A'} />
             <DetailRow label="Store Address" value={order.store.address || 'N/A'}  />
            <DetailRow label="Customer Name" value={order.customer.name || 'N/A'} />
            <DetailRow label="Customer Email" value={order.customer.email || 'N/A'} />
            <DetailRow label="Customer Phone" value={order.customer.phone || 'N/A'} />
            <DetailRow label="Customer Address" value={order.customer.address || 'N/A'} />
          
            {/* <DetailRow
              label="Updated"
              value={format(parseISO(order.updatedAt), 'dd MMM yyyy, h:mm a')}
            /> */}
          </div>
        </div>

        {order.statusLogs?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3">
              Status history
            </h4>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              {order.statusLogs.map((log) => (
                <div
                  key={log._id}
                  className="flex justify-between items-center px-4 py-3 gap-4"
                >
                  <span className="text-sm font-medium text-slate-800 capitalize">
                    {log.status}
                  </span>
                  <span className="text-xs text-gray-500 shrink-0">
                    {format(parseISO(log.timestamp), 'dd MMM yyyy, h:mm a')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  )
}

function DetailRow({
  label,
  value,
  emphasize,
  capitalize,
  mono,
}: {
  label: string
  value: string
  emphasize?: boolean
  capitalize?: boolean
  mono?: boolean
}) {
  return (
    <div className="flex justify-between items-center px-4 py-3 gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={cn(
          'text-sm text-slate-800 text-right break-all',
          emphasize && 'font-bold',
          capitalize && 'capitalize',
          mono && 'font-mono text-xs'
        )}
      >
        {value}
      </span>
    </div>
  )
}

