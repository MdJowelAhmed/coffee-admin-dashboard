import { Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/cn'
import { NOTIFICATION_TYPES } from '../constants'

const readOptions = [
  { value: 'all', label: 'All' },
  { value: 'Read', label: 'Read' },
  { value: 'Unread', label: 'Unread' },
] as const

interface NotificationFilterDropdownProps {
  typeValue: string
  readValue: string
  onTypeChange: (value: string) => void
  onReadChange: (value: string) => void
  className?: string
}

export function NotificationFilterDropdown({
  typeValue,
  readValue,
  onTypeChange,
  onReadChange,
  className,
}: NotificationFilterDropdownProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select value={typeValue} onValueChange={onTypeChange}>
        <SelectTrigger
          className={cn(
            'w-44 bg-secondary text-white hover:bg-primary/90 border-primary rounded-md',
            'focus:ring-primary focus:ring-offset-0'
          )}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 shrink-0" />
            <SelectValue placeholder="Type" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="cursor-pointer">
            All types
          </SelectItem>
          {NOTIFICATION_TYPES.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="cursor-pointer"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={readValue} onValueChange={onReadChange}>
        <SelectTrigger
          className={cn(
            'w-40 bg-secondary text-white hover:bg-primary/90 border-primary rounded-md',
            'focus:ring-primary focus:ring-offset-0'
          )}
        >
          <SelectValue placeholder="Read status" />
        </SelectTrigger>
        <SelectContent>
          {readOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
