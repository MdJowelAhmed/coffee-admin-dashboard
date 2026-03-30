import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  useCreateCustomizeMutation,
  useUpdateCustomizeMutation,
} from '@/redux/api/customizeApi'
import type { MilkType } from '@/types'
import { toast } from '@/utils/toast'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be 0 or more'),
})

type FormData = z.infer<typeof schema>

interface AddEditMilkTypeModalProps {
  open: boolean
  onClose: () => void
  editingId: string | null
  milkType: MilkType | null
}

export function AddEditMilkTypeModal({
  open,
  onClose,
  editingId,
  milkType,
}: AddEditMilkTypeModalProps) {
  const isEdit = !!editingId
  const [createCustomize, { isLoading: isCreating }] = useCreateCustomizeMutation()
  const [updateCustomize, { isLoading: isUpdating }] = useUpdateCustomizeMutation()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', price: 0 },
  })

  useEffect(() => {
    if (open) {
      if (isEdit && milkType) {
        reset({ name: milkType.name, price: milkType.price })
      } else {
        reset({ name: '', price: 0 })
      }
    }
  }, [open, isEdit, milkType, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && milkType) {
        await updateCustomize({
          id: milkType.id,
          name: data.name,
          price: data.price,
          type: 'milk',
        }).unwrap()
        toast({ title: 'Updated', description: 'Milk type updated successfully.' })
      } else {
        await createCustomize({
          name: data.name,
          price: data.price,
          type: 'milk',
        }).unwrap()
        toast({ title: 'Added', description: 'Milk type added successfully.' })
      }
      onClose()
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to save milk type. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Milk Type' : 'Add Milk Type'}
      size="md"
      className="max-w-lg bg-white"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Name"
          placeholder="Enter name"
          error={errors.name?.message}
          required
          {...register('name')}
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
          {/* <Button type="button" variant="outline" onClick={onClose}>Cancel</Button> */}
          <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
            {isEdit ? 'Saving' : 'Add Milk Type'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
