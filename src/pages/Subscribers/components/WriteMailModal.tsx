import { useState } from 'react'
import { format, parseISO } from 'date-fns'
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
import { cn } from '@/utils/cn'
import { toast } from '@/utils/toast'
import type { SendMailPayload } from '@/types'

interface WriteMailModalProps {
  open: boolean
  onClose: () => void
  onSent?: (payload: SendMailPayload) => void | Promise<void>
  isSending?: boolean
}

export function WriteMailModal({
  open,
  onClose,
  onSent,
  isSending = false,
}: WriteMailModalProps) {
  const [subject, setSubject] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleClose = () => {
    setSubject('')
    setDateFrom('')
    setDateTo('')
    setTitle('')
    setDescription('')
    onClose()
  }

  const handleSent = async () => {
    if (!subject.trim()) {
      toast({
        title: 'Validation',
        description: 'Please enter a subject.',
        variant: 'destructive',
      })
      return
    }
    if (!title.trim()) {
      toast({
        title: 'Validation',
        description: 'Please enter a title.',
        variant: 'destructive',
      })
      return
    }
    if (!description.trim()) {
      toast({
        title: 'Validation',
        description: 'Please enter a description.',
        variant: 'destructive',
      })
      return
    }
    if (!dateFrom || !dateTo) {
      toast({
        title: 'Validation',
        description: 'Please select both start and end date.',
        variant: 'destructive',
      })
      return
    }

    const payload: SendMailPayload = {
      subject: subject.trim(),
      title: title.trim(),
      description: description.trim(),
      startDate: dateFrom,
      endDate: dateTo,
    }

    try {
      if (onSent) {
        await onSent(payload)
      }
      handleClose()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send mail. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const dateRangeDisplay = (() => {
    if (!dateFrom && !dateTo) return ''
    try {
      if (dateFrom && dateTo) {
        return `${format(parseISO(dateFrom), 'dd-MM-yyyy')} - ${format(parseISO(dateTo), 'dd-MM-yyyy')}`
      }
      return dateFrom
        ? format(parseISO(dateFrom), 'dd-MM-yyyy')
        : dateTo
          ? format(parseISO(dateTo), 'dd-MM-yyyy')
          : ''
    } catch {
      return ''
    }
  })()

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
            Write a mail
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 overflow-y-auto">
          <div className="space-y-2">
            <Label
              htmlFor="mail-subject"
              className="text-sm font-medium text-slate-700"
            >
              Subject
            </Label>
            <Input
              id="mail-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Welcome to the Coffecito Elite Club!"
              className="rounded-md border border-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="mail-date"
              className="text-sm font-medium text-slate-700"
            >
              Start &amp; end date
            </Label>
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                id="mail-date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="flex-1 min-w-[120px] rounded-md border border-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                id="mail-date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="flex-1 min-w-[120px] rounded-md border border-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            {dateRangeDisplay && (
              <p className="text-xs text-muted-foreground">{dateRangeDisplay}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="mail-title"
              className="text-sm font-medium text-slate-700"
            >
              Title
            </Label>
            <Input
              id="mail-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="You're officially a member of the club!"
              className="rounded-md border border-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="mail-description"
              className="text-sm font-medium text-slate-700"
            >
              Description
            </Label>
            <Textarea
              id="mail-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="HTML body for the email..."
              rows={6}
              className="rounded-md border border-primary/40 focus-visible:ring-2 focus-visible:ring-primary resize-none font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            onClick={handleSent}
            disabled={isSending}
            isLoading={isSending}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Sent Mail
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
