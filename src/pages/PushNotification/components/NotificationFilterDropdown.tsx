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

/** Keep Select controlled value in sync with URL / API (must match a SelectItem `value`) */
function normalizeTypeValue(raw: string): string {
  if (raw === 'all') return 'all'
  if (NOTIFICATION_TYPES.some((t) => t.value === raw)) return raw
  return 'all'
}

function normalizeReadValue(raw: string): string {
  if (raw === 'all' || raw === 'Read' || raw === 'Unread') return raw
  return 'all'
}

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
  const safeType = normalizeTypeValue(typeValue)
  const safeRead = normalizeReadValue(readValue)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select value={safeType} onValueChange={onTypeChange}>
        <SelectTrigger
          className={cn(
            'w-44 bg-secondary text-white hover:bg-primary/90 border-primary rounded-md',
            'focus:ring-primary focus:ring-offset-0',
            '[&_svg.lucide]:text-white'
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
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
      <Select value={safeRead} onValueChange={onReadChange}>
        <SelectTrigger
          className={cn(
            'w-40 bg-secondary text-white hover:bg-primary/90 border-primary rounded-md',
            'focus:ring-primary focus:ring-offset-0',
            '[&_svg.lucide]:text-white'
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
