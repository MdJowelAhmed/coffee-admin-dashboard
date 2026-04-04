import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/cn'
import { toast } from '@/utils/toast'
import { useSendPushNotificationMutation } from '@/redux/api/pushNotificationApi'
import type { NotificationApiType } from '@/types'
import { NOTIFICATION_TYPES } from '../constants'

interface SendNotificationModalProps {
  open: boolean
  onClose: () => void
}

export function SendNotificationModal({
  open,
  onClose,
}: SendNotificationModalProps) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<NotificationApiType | ''>('')
  const [sendNotification, { isLoading }] = useSendPushNotificationMutation()

  const handleClose = () => {
    setTitle('')
    setMessage('')
    setType('')
    onClose()
  }

  const handleSent = async () => {
    if (!title.trim()) {
      toast({
        title: 'Validation',
        description: 'Please enter a title.',
        variant: 'destructive',
      })
      return
    }
    if (!message.trim()) {
      toast({
        title: 'Validation',
        description: 'Please enter a message.',
        variant: 'destructive',
      })
      return
    }
    if (!type) {
      toast({
        title: 'Validation',
        description: 'Please select a type.',
        variant: 'destructive',
      })
      return
    }

    try {
      await sendNotification({
        title: title.trim(),
        message: message.trim(),
        type,
      }).unwrap()
      toast({
        title: 'Success',
        description: 'Notification sent successfully.',
        variant: 'success',
      })
      handleClose()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send notification. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className={cn(
          'max-w-lg flex flex-col max-h-[90vh]',
          'bg-white rounded-xl border border-border shadow-lg'
        )}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-left text-lg font-bold text-slate-800">
            Send a notification
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 overflow-y-auto">
          <div className="space-y-2">
            <Label
              htmlFor="notification-title"
              className="text-sm font-medium text-slate-700"
            >
              Title
            </Label>
            <Input
              id="notification-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New Coffee Today"
              className="rounded-md border border-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="notification-message"
              className="text-sm font-medium text-slate-700"
            >
              Message
            </Label>
            <Textarea
              id="notification-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, there is new coffee just for you"
              rows={4}
              className="rounded-md border border-primary/40 focus-visible:ring-2 focus-visible:ring-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="notification-type"
              className="text-sm font-medium text-slate-700"
            >
              Type
            </Label>
            <Select
              value={type || undefined}
              onValueChange={(v) => setType(v as NotificationApiType)}
            >
              <SelectTrigger
                id="notification-type"
                className="rounded-md border border-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_TYPES.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            onClick={handleSent}
            disabled={isLoading}
            isLoading={isLoading}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Send notification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
