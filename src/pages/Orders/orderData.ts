import type { SelectOption } from '@/types'

export const orderStatusFilterOptions: SelectOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Cancelled', label: 'Cancelled' },
]
