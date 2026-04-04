import { Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/cn'
import type { UserStatus } from '@/types'

interface UserFilterDropdownProps {
  value: UserStatus | 'all'
  onChange: (value: UserStatus | 'all') => void
  className?: string
}

const statusFilterOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'pending', label: 'Pending' },
] as const

const allowedStatus = new Set(
  statusFilterOptions.map((o) => o.value)
)

function normalizeStatus(value: UserStatus | 'all'): UserStatus | 'all' {
  if (value && allowedStatus.has(value)) return value
  return 'all'
}

export function UserFilterDropdown({ value, onChange, className }: UserFilterDropdownProps) {
  const safeValue = normalizeStatus(value)

  return (
    <Select
      value={safeValue}
      onValueChange={(val) => onChange(val as UserStatus | 'all')}
    >
      <SelectTrigger
        className={cn(
          'w-[11rem] min-w-[11rem] bg-secondary hover:bg-secondary/90 text-white border-secondary rounded-md',
          'focus:ring-secondary focus:ring-offset-0',
          '[&_svg.lucide]:text-white',
          className
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Filter className="h-4 w-4 shrink-0" />
          <SelectValue placeholder="All Status" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {statusFilterOptions.map((option) => (
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
  )
}
