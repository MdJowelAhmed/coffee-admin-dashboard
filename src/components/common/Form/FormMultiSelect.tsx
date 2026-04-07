import { useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/utils/cn'
import type { SelectOption } from '@/types'

/** Matches `SelectTrigger` in `@/components/ui/select` so multi-select looks like `FormSelect`. */
const triggerClassName = cn(
  'flex h-11 w-full items-center justify-between rounded-sm border border-input bg-white px-3 py-2 text-sm ring-offset-background',
  'placeholder:text-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50 transition-colors text-left font-normal'
)

interface FormMultiSelectProps {
  label?: string
  value: string[]
  options: SelectOption[]
  onChange: (values: string[]) => void
  placeholder?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  className?: string
  name?: string
  /** Message when `options` is empty */
  emptyMessage?: string
}

export function FormMultiSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select…',
  error,
  helperText,
  required,
  disabled,
  className,
  name,
  emptyMessage = 'No options available',
}: FormMultiSelectProps) {
  const selectedSet = useMemo(() => new Set(value), [value])

  const display = useMemo(() => {
    if (value.length === 0) return placeholder
    const labels = options
      .filter((o) => selectedSet.has(o.value))
      .map((o) => o.label)
    return labels.length > 0 ? labels.join(', ') : placeholder
  }, [value, options, placeholder, selectedSet])

  const toggle = (id: string) => {
    if (selectedSet.has(id)) {
      onChange(value.filter((x) => x !== id))
    } else {
      onChange([...value, id])
    }
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <Label htmlFor={name} className={cn(error && 'text-destructive')}>
          {label}
          {required ? <span className="ml-1 text-destructive">*</span> : null}
        </Label>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button
            type="button"
            id={name}
            className={cn(triggerClassName, error && 'border-destructive focus:ring-destructive')}
          >
            <span
              className={cn(
                'line-clamp-1',
                value.length === 0 ? 'text-muted-foreground' : 'text-foreground'
              )}
            >
              {display}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-96 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-lg border bg-white p-1 shadow-md"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {options.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            options.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={selectedSet.has(opt.value)}
                onCheckedChange={() => toggle(opt.value)}
                className="rounded-sm py-1.5 focus:bg-secondary focus:text-white"
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {helperText && !error ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}
