import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/utils/constants'
import { formatFileSize } from '@/utils/formatters'

interface ImageUploaderProps {
  value?: string | File | null
  onChange: (file: File | null) => void
  className?: string
  maxSize?: number
  acceptedTypes?: string[]
  error?: string
}

export function ImageUploader({
  value,
  onChange,
  className,
  maxSize = MAX_IMAGE_SIZE,
  acceptedTypes = ACCEPTED_IMAGE_TYPES,
  error,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  )
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    if (typeof value === 'string' && value.length > 0) {
      setPreview(value)
      return
    }
    setPreview(null)
  }, [value])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setUploadError(null)

      if (fileRejections.length > 0) {
        const firstError = fileRejections[0].errors[0]
        setUploadError(firstError.message)
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.onload = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        onChange(file)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onChange(null)
    setUploadError(null)
  }

  const displayError = error || uploadError

  return (
    <div className={cn('space-y-2', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer',
          'hover:border-primary/50 hover:bg-primary/5',
          isDragActive && 'border-primary bg-primary/10',
          displayError && 'border-destructive',
          preview ? 'p-2' : 'p-8'
        )}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className={cn(
                'p-4 rounded-full transition-colors',
                isDragActive ? 'bg-primary/20' : 'bg-muted'
              )}
            >
              {isDragActive ? (
                <Upload className="h-8 w-8 text-primary" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop your image here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported: JPG, PNG, WebP (max {formatFileSize(maxSize)})
              </p>
            </div>
          </div>
        )}
      </div>
      {displayError && (
        <p className="text-sm text-destructive">{displayError}</p>
      )}
    </div>
  )
}










