import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, FormTextarea } from '@/components/common'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/redux/hooks'
import { addShopCategory, updateShopCategory } from '@/redux/slices/shopCategorySlice'
import type { ShopCategory } from '@/types'
import { toast } from '@/utils/toast'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
})

type FormData = z.infer<typeof schema>

interface AddEditShopCategoryModalProps {
  open: boolean
  onClose: () => void
  editingId: string | null
  category: ShopCategory | null
}

export function AddEditShopCategoryModal({
  open,
  onClose,
  editingId,
  category,
}: AddEditShopCategoryModalProps) {
  const dispatch = useAppDispatch()
  const isEdit = !!editingId

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', shortDescription: '' },
  })

  useEffect(() => {
    if (open) {
      if (isEdit && category) {
        reset({ name: category.name, shortDescription: category.shortDescription })
      } else {
        reset({ name: '', shortDescription: '' })
      }
    }
  }, [open, isEdit, category, reset])

  const onSubmit = (data: FormData) => {
    const now = new Date().toISOString()
    const payload: ShopCategory = {
      id: isEdit && category ? category.id : Date.now().toString(),
      name: data.name,
      shortDescription: data.shortDescription,
      isActive: isEdit && category ? category.isActive : true,
      createdAt: isEdit && category ? category.createdAt : now,
      updatedAt: now,
    }
    if (isEdit) {
      dispatch(updateShopCategory(payload))
      toast({ title: 'Updated', description: 'Category updated successfully.' })
    } else {
      dispatch(addShopCategory(payload))
      toast({ title: 'Added', description: 'Category added successfully.' })
    }
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'Add Category'}
      size="md"
      className="bg-white"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Name"
          placeholder="Enter category name"
          error={errors.name?.message}
          required
          {...register('name')}
        />
        <FormTextarea
          label="Short Description"
          placeholder="Brief description of this category"
          error={errors.shortDescription?.message}
          required
          rows={3}
          {...register('shortDescription')}
        />
        <div className="flex justify-end gap-3 pt-4">
          {/* <Button type="button" variant="outline" onClick={onClose}>Cancel</Button> */}
          <Button type="submit" disabled={isSubmitting}>{isEdit ? 'Saving...' : 'Add Category'}</Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
