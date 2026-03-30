import { useEffect, useState } from 'react'
import { ModalWrapper } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateOrderStatusMutation } from '@/redux/api/ordersApi'
import {
  ORDER_STATUS_UPDATE_OPTIONS,
  type AdminOrder,
} from '@/redux/packageTypes/orders'
import { toast } from '@/utils/toast'

interface OrderStatusUpdateModalProps {
  open: boolean
  onClose: () => void
  order: AdminOrder | null
}

export function OrderStatusUpdateModal({
  open,
  onClose,
  order,
}: OrderStatusUpdateModalProps) {
  const [status, setStatus] = useState('')
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation()

  useEffect(() => {
    if (order && open) {
      setStatus(String(order.orderStatus ?? '').toLowerCase())
    }
  }, [order, open])

  const handleSave = async () => {
    if (!order || !status) return
    try {
      await updateOrderStatus({ id: order._id, status }).unwrap()
      toast({
        variant: 'success',
        title: 'Status updated',
        description: `Order ${order.orderId} is now ${status}.`,
      })
      onClose()
    } catch {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Could not update order status. Try again.',
      })
    }
  }

  if (!order) return null

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Update order status"
      size="md"
      className="max-w-md bg-white"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Order <span className="font-semibold text-slate-800">{order.orderId}</span>
        </p>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUS_UPDATE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !status}
            className="min-w-[96px]"
          >
            {isLoading ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}
