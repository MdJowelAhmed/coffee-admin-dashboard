import { ChevronDown, Filter } from 'lucide-react'
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

export function UserFilterDropdown({ value, onChange, className }: UserFilterDropdownProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as UserStatus | 'all')}>
      <SelectTrigger
        className={cn(
          'w-40 bg-secondary hover:bg-secondary/90 text-white border-secondary rounded-md',
          'focus:ring-secondary focus:ring-offset-0',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 shrink-0" />
          <SelectValue placeholder="Filter" />
          <ChevronDown className="h-4 w-4 ml-auto" />
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
