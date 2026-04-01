import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput } from '@/components/common'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils/toast'
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/redux/api/CategoryApi'
import type { Category } from '@/redux/packageTypes/category'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
})

type FormData = z.infer<typeof schema>

interface AddEditShopCategoryModalProps {
  open: boolean
  onClose: () => void
  editingId: string | null
  category: Category | null
}

export function AddEditShopCategoryModal({
  open,
  onClose,
  editingId,
  category,
}: AddEditShopCategoryModalProps) {
  const isEdit = !!editingId
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (open) {
      if (isEdit && category) {
        reset({ name: category.name })
      } else {
        reset({ name: '' })
      }
    }
  }, [open, isEdit, category, reset])

  const onSubmit = async (data: FormData) => {
    if (isEdit && category) {
      await updateCategory({ id: category.id, name: data.name }).unwrap()
      toast({ title: 'Updated', description: 'Category updated successfully.' })
      onClose()
      return
    }

    await createCategory({ name: data.name }).unwrap()
    toast({ title: 'Added', description: 'Category added successfully.' })
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
        <div className="flex justify-end gap-3 pt-4">
          {/* <Button type="button" variant="outline" onClick={onClose}>Cancel</Button> */}
          <Button type="submit" disabled={isSubmitting}>{isEdit ? 'Saving...' : 'Add Category'}</Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
