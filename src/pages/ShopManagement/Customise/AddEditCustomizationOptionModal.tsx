import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  useCreateCustomizeOptionMutation,
  useUpdateCustomizeOptionMutation,
} from '@/redux/api/customizeApi'
import type { ApiCustomizeOption } from '@/redux/packageTypes/customize'
import { toast } from '@/utils/toast'

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
  price: z.number().min(0, 'Price must be 0 or more'),
})

type FormData = z.infer<typeof schema>

interface AddEditCustomizationOptionModalProps {
  open: boolean
  onClose: () => void
  customizationId: string | null
  categoryName: string
  editingOption: ApiCustomizeOption | null
}

export function AddEditCustomizationOptionModal({
  open,
  onClose,
  customizationId,
  categoryName,
  editingOption,
}: AddEditCustomizationOptionModalProps) {
  const isEdit = !!editingOption
  const [createOption, { isLoading: isCreating }] = useCreateCustomizeOptionMutation()
  const [updateOption, { isLoading: isUpdating }] = useUpdateCustomizeOptionMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { label: '', price: 0 },
  })

  useEffect(() => {
    if (!open) return
    if (isEdit && editingOption) {
      reset({ label: editingOption.label, price: editingOption.price })
    } else {
      reset({ label: '', price: 0 })
    }
  }, [open, isEdit, editingOption, reset])

  const onSubmit = async (data: FormData) => {
    if (!customizationId) return
    try {
      if (isEdit && editingOption) {
        await updateOption({
          id: customizationId,
          optionId: editingOption._id,
          label: data.label,
          price: data.price,
        }).unwrap()
        toast({ title: 'Updated', description: 'Option updated successfully.' })
      } else {
        await createOption({
          id: customizationId,
          label: data.label,
          price: data.price,
        }).unwrap()
        toast({ title: 'Added', description: 'Option added successfully.' })
      }
      onClose()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save option. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit option — ${categoryName}` : `Add option — ${categoryName}`}
      size="md"
      className="max-w-lg bg-white"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Label"
          placeholder="e.g. Soy Milk"
          error={errors.label?.message}
          required
          {...register('label')}
        />
        <FormInput
          label="Price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.price?.message}
          required
          {...register('price', { valueAsNumber: true })}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting || isCreating || isUpdating || !customizationId}>
            {isEdit ? 'Save changes' : 'Add option'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
