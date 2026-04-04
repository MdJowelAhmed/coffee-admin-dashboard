import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, ImageUploader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { useCreatePromotionMutation } from '@/redux/api/adManagerApi'
import { sonnerToast } from '@/utils/toast'

const posterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

type PosterFormData = z.infer<typeof posterSchema>

interface AddPosterModalProps {
  open: boolean
  onClose: () => void
}

export function AddPosterModal({ open, onClose }: AddPosterModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [createPromotion, { isLoading: isSubmitting }] =
    useCreatePromotionMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PosterFormData>({
    resolver: zodResolver(posterSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (open) {
      reset({ name: '' })
      setImageFile(null)
    }
  }, [open, reset])

  const onSubmit = async (data: PosterFormData) => {
    if (!imageFile) {
      sonnerToast.error('Please upload an image')
      return
    }
    try {
      await createPromotion({ name: data.name.trim(), image: imageFile }).unwrap()
      sonnerToast.success('Promotion created successfully')
      onClose()
    } catch {
      sonnerToast.error('Failed to create promotion')
    }
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Add New Poster"
      description="Upload an image and set the promotion name (sent as form-data: name + image)."
      size="lg"
      className="bg-white"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ImageUploader
          key={open ? 'open' : 'closed'}
          value={imageFile}
          onChange={setImageFile}
        />
        <FormInput
          label="Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="e.g. special promotions"
        />
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
            Add Poster
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
