import { AlertTriangle } from 'lucide-react'
import { ModalWrapper } from '@/components/common'
import { Button } from '@/components/ui/button'
import type { Poster } from '@/types'

interface DeletePosterModalProps {
  open: boolean
  onClose: () => void
  poster: Poster | null
  onConfirm: () => void | Promise<void>
  isDeleting?: boolean
}

export function DeletePosterModal({
  open,
  onClose,
  poster,
  onConfirm,
  isDeleting = false,
}: DeletePosterModalProps) {
  if (!poster) return null

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Delete Poster"
      size="md"
      className="max-w-md bg-white"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600">
              This will permanently delete the poster: <strong>{poster.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            isLoading={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}
