import { format, parseISO } from 'date-fns'
import { ModalWrapper } from '@/components/common'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import { resolveMediaUrl } from '@/utils/mediaUrl'
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
    ready: 'bg-teal-500',
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
          <div className="w-full overflow-auto border border-gray-200 rounded-lg">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-success text-slate-800">
                  <th className="px-4 py-3 text-left text-sm font-bold">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-bold"> Customizations</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Qty</th>
                  <th className="px-4 py-3 text-right text-sm font-bold">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((line, idx) => {
                  const p = line.product
                  const imgPath =
                    typeof p === 'object' && p && 'image' in p ? (p.image as string | undefined) : undefined
                  const imgSrc = resolveMediaUrl(imgPath)
                  return (
                    <tr key={idx} className="hover:bg-gray-50 align-top">
                      <td className="px-4 py-3">
                        <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={line.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-slate-800">{line.productName}</div>
                        <div className="text-xs text-gray-500">
                          Base {formatCurrency(line.basePrice)} · Unit {formatCurrency(line.unitFinalPrice)}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[200px] overflow-hidden text-ellipsis">
                        {line.selectedCustomizations?.length > 0 ? (
                          <ul className="space-y-1 text-xs text-gray-600">
                            {line.selectedCustomizations.map((c, i) => (
                              <li key={c.customizationId + i} className="leading-5">
                                {formatCustomization(c)}
                                {c.totalPrice != null && c.totalPrice > 0 ? (
                                  <span className="text-slate-700"> (+{formatCurrency(c.totalPrice)})</span>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800">{line.quantity}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-slate-800">
                        {formatCurrency(line.itemTotalPrice)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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

