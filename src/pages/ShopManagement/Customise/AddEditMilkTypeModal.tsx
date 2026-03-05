import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput } from '@/components/common'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/redux/hooks'
import { addMilkType, updateMilkType } from '@/redux/slices/milkTypeSlice'
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
  const dispatch = useAppDispatch()
  const isEdit = !!editingId

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

  const onSubmit = (data: FormData) => {
    const now = new Date().toISOString()
    const payload: MilkType = {
      id: isEdit && milkType ? milkType.id : Date.now().toString(),
      name: data.name,
      price: data.price,
      type: 'milk',
      isActive: isEdit && milkType ? milkType.isActive : true,
      createdAt: isEdit && milkType ? milkType.createdAt : now,
      updatedAt: now,
    }
    if (isEdit) {
      dispatch(updateMilkType(payload))
      toast({ title: 'Updated', description: 'Milk type updated successfully.' })
    } else {
      dispatch(addMilkType(payload))
      toast({ title: 'Added', description: 'Milk type added successfully.' })
    }
    onClose()
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
          <Button type="submit" disabled={isSubmitting}>{isEdit ? 'Saving...' : 'Add Milk Type'}</Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
