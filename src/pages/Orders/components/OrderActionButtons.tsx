import { Eye, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AdminOrder } from '@/redux/packageTypes/orders'

interface OrderActionButtonsProps {
  order: AdminOrder
  onView: (order: AdminOrder) => void
  onUpdateStatus: (order: AdminOrder) => void
}

export function OrderActionButtons({
  order,
  onView,
  onUpdateStatus,
}: OrderActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onView(order)}
        className="h-10 w-10 hover:bg-gray-100"
        title="View details"
      >
        <Eye className="h-6 w-6 text-gray-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onUpdateStatus(order)}
        className="h-10 w-10 hover:bg-gray-100"
        title="Update status"
      >
        <RefreshCw className="h-5 w-5 text-gray-600" />
      </Button>
    </div>
  )
}
