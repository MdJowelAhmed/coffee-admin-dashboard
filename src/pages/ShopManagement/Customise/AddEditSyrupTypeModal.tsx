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
import type { SyrupType } from '@/types'
import { toast } from '@/utils/toast'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be 0 or more'),
})

type FormData = z.infer<typeof schema>

interface AddEditSyrupTypeModalProps {
  open: boolean
  onClose: () => void
  editingId: string | null
  syrupType: SyrupType | null
}

export function AddEditSyrupTypeModal({
  open,
  onClose,
  editingId,
  syrupType,
}: AddEditSyrupTypeModalProps) {
  const isEdit = !!editingId
  const [createCustomize, { isLoading: isCreating }] = useCreateCustomizeMutation()
  const [updateCustomize, { isLoading: isUpdating }] = useUpdateCustomizeMutation()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', price: 0 },
  })

  useEffect(() => {
    if (open) {
      if (isEdit && syrupType) {
        reset({ name: syrupType.name, price: syrupType.price })
      } else {
        reset({ name: '', price: 0 })
      }
    }
  }, [open, isEdit, syrupType, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && syrupType) {
        await updateCustomize({
          id: syrupType.id,
          name: data.name,
          price: data.price,
          type: 'syrup',
        }).unwrap()
        toast({ title: 'Updated', description: 'Syrup type updated successfully.' })
      } else {
        await createCustomize({
          name: data.name,
          price: data.price,
          type: 'syrup',
        }).unwrap()
        toast({ title: 'Added', description: 'Syrup type added successfully.' })
      }
      onClose()
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to save syrup type. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Syrup Type' : 'Add Syrup Type'}
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
          {/*   <Button type="button" variant="outline" onClick={onClose}>Cancel</Button> */}
          <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
            {isEdit ? 'Saving' : 'Add Syrup Type'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
