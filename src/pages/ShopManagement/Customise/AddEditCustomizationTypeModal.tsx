import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCreateCustomizeMutation,
  useUpdateCustomizeMutation,
} from '@/redux/api/customizeApi'
import type { ApiCustomizeItem, CustomizationSelectionMode } from '@/redux/packageTypes/customize'
import { toast } from '@/utils/toast'

const MODES: { value: CustomizationSelectionMode; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'multi', label: 'Multi' },
  { value: 'quantity', label: 'Quantity' },
]

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['single', 'multi', 'quantity']),
  isRequired: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface AddEditCustomizationTypeModalProps {
  open: boolean
  onClose: () => void
  editingId: string | null
  customization: ApiCustomizeItem | null
}

export function AddEditCustomizationTypeModal({
  open,
  onClose,
  editingId,
  customization,
}: AddEditCustomizationTypeModalProps) {
  const isEdit = !!editingId
  const [createCustomize, { isLoading: isCreating }] = useCreateCustomizeMutation()
  const [updateCustomize, { isLoading: isUpdating }] = useUpdateCustomizeMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', type: 'single', isRequired: false },
  })

  useEffect(() => {
    if (!open) return
    if (isEdit && customization) {
      const t = customization.type
      const typeValue: CustomizationSelectionMode =
        t === 'single' || t === 'multi' || t === 'quantity' ? t : 'single'
      reset({
        name: customization.name,
        type: typeValue,
        isRequired: customization.isRequired,
      })
    } else {
      reset({ name: '', type: 'single', isRequired: false })
    }
  }, [open, isEdit, customization, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && customization) {
        await updateCustomize({
          id: customization._id,
          name: data.name,
          type: data.type,
          isRequired: data.isRequired,
        }).unwrap()
        toast({ title: 'Updated', description: 'Customization type updated successfully.' })
      } else {
        await createCustomize({
          name: data.name,
          type: data.type,
          isRequired: data.isRequired,
        }).unwrap()
        toast({ title: 'Added', description: 'Customization type added successfully.' })
      }
      onClose()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save customization type. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit customization type' : 'Add customization type'}
      size="md"
      className="max-w-lg bg-white"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Name"
          placeholder="e.g. Flavour"
          error={errors.name?.message}
          required
          {...register('name')}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800">Selection type</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {MODES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.type?.message ? (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          ) : null}
        </div>
        <Controller
          name="isRequired"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="isRequired"
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
              />
              <label htmlFor="isRequired" className="text-sm font-medium text-slate-800">
                Required for customers
              </label>
            </div>
          )}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
            {isEdit ? 'Save changes' : 'Add type'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
