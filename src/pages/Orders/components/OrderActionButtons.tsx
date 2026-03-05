import { Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Order } from '@/types'

interface OrderActionButtonsProps {
  order: Order
  onView: (order: Order) => void
  onDelete: (order: Order) => void
}

export function OrderActionButtons({
  order,
  onView,
  onDelete,
}: OrderActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onView(order)}
        className="h-10 w-10 hover:bg-gray-100"
      >
        <Eye className="h-6 w-6 text-gray-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(order)}
        className="h-10 w-10 hover:bg-red-50"
      >
        <Trash2 className="h-6 w-6 text-red-600" />
      </Button>
    </div>
  )
}
