import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, FormTextarea, ImageUploader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/redux/hooks'
import { addPoster } from '@/redux/slices/adSlice'
import type { Poster } from '@/types'
import { sonnerToast } from '@/utils/toast'

const posterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

type PosterFormData = z.infer<typeof posterSchema>

interface AddPosterModalProps {
  open: boolean
  onClose: () => void
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function AddPosterModal({ open, onClose }: AddPosterModalProps) {
  const dispatch = useAppDispatch()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PosterFormData>({
    resolver: zodResolver(posterSchema),
    defaultValues: { title: '', description: '' },
  })

  useEffect(() => {
    if (open) {
      reset({ title: '', description: '' })
      setImageFile(null)
    }
  }, [open, reset])

  const onSubmit = async (data: PosterFormData) => {
    if (!imageFile) {
      sonnerToast.error('Please upload an image')
      return
    }
    setIsSubmitting(true)
    try {
      const imageUrl = await fileToDataUrl(imageFile)
      const poster: Poster = {
        id: crypto.randomUUID(),
        imageUrl,
        title: data.title,
        description: data.description || '',
        createdAt: new Date().toISOString(),
      }
      dispatch(addPoster(poster))
      sonnerToast.success('Poster added successfully')
      onClose()
    } catch {
      sonnerToast.error('Failed to add poster')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Add New Poster"
      description="Upload an image and add title and description for the ad."
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
          label="Title"
          {...register('title')}
          error={errors.title?.message}
          placeholder="e.g. Coffee"
        />
        <FormTextarea
          label="Description (optional)"
          {...register('description')}
          error={errors.description?.message}
          placeholder="Short description for the offer"
          rows={3}
        />
        <div className="flex justify-end gap-3 pt-4 border-t">
          {/* <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button> */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Poster'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
