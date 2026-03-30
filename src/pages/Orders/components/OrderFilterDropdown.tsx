import { useState } from 'react'
import { Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { orderStatusFilterOptions } from '../orderData'
import { cn } from '@/utils/cn'

export type OrderFilterStatusValue = string

interface OrderFilterDropdownProps {
  value: OrderFilterStatusValue
  onChange: (value: OrderFilterStatusValue) => void
  className?: string
}

export function OrderFilterDropdown({
  value,
  onChange,
  className,
}: OrderFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'bg-secondary hover:bg-secondary/80 text-white border-secondary hover:text-white',
            'flex items-center gap-2',
            className
          )}
        >
          <Filter className="h-4 w-4" />
          Filter
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {orderStatusFilterOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              onChange(option.value)
              setIsOpen(false)
            }}
            className={cn(
              'cursor-pointer',
              value === option.value && 'bg-gray-100 font-semibold'
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
