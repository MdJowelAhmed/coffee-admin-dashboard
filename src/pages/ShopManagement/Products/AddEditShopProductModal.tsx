import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ModalWrapper,
  FormInput,
  FormSelect,
  FormMultiSelect,
  FormTextarea,
  ImageUploader,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import { MAX_IMAGE_SIZE } from '@/utils/constants'
import { useGetCategoriesQuery } from '@/redux/api/CategoryApi'
import { useGetCustomizeQuery } from '@/redux/api/customizeApi'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/redux/api/productsApi'
import { useGetShopsQuery } from '@/redux/api/shopManagementApi'
import type { ApiProduct, ProductFormDataPayload } from '@/redux/packageTypes/products'
import type { SelectOption } from '@/types'
import { toast } from '@/utils/toast'
import { resolveMediaUrl } from '@/utils/formatters'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  basePrice: z.number().min(0, 'Price must be 0 or more'),
  categoryId: z.string().min(1, 'Category is required'),
  storeId: z.string().min(1, 'Store is required'),
  readyTime: z.number().int().min(1, 'Ready time must be at least 1 minute'),
  isActive: z.boolean(),
  dietaryLabels: z.string(),
})

type FormData = z.infer<typeof schema>

interface AddEditShopProductModalProps {
  open: boolean
  onClose: () => void
  editingId: string | null
  product: ApiProduct | null
}

export function AddEditShopProductModal({
  open,
  onClose,
  editingId,
  product,
}: AddEditShopProductModalProps) {
  const isEdit = !!editingId
  const [image, setImage] = useState<File | string | null>(null)
  const [customizationIds, setCustomizationIds] = useState<string[]>([])

  const { data: shopsResult, isLoading: shopsLoading } = useGetShopsQuery({
    page: 1,
    limit: 200,
  })
  const { data: categoriesResult, isLoading: categoriesLoading } = useGetCategoriesQuery({
    page: 1,
    limit: 200,
  })
  const { data: customizeResult, isLoading: customizeLoading } = useGetCustomizeQuery({
    page: 1,
    limit: 200,
  })

  const [createProduct, { isLoading: creating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation()

  const customizationSelectOptions: SelectOption[] = useMemo(
    () =>
      (customizeResult?.items ?? []).map((item) => ({
        value: item._id,
        label: item.name,
      })),
    [customizeResult?.items],
  )

  const storeOptions: SelectOption[] = useMemo(
    () =>
      (shopsResult?.items ?? []).map((s) => ({
        value: s._id,
        label: s.name,
      })),
    [shopsResult?.items],
  )

  const categoryOptions: SelectOption[] = useMemo(
    () =>
      (categoriesResult?.items ?? []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [categoriesResult?.items],
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      basePrice: 0,
      categoryId: '',
      storeId: '',
      readyTime: 5,
      isActive: true,
      dietaryLabels: '',
    },
  })

  const watchedCategoryId = watch('categoryId')
  const watchedStoreId = watch('storeId')

  useEffect(() => {
    if (!open) return
    if (isEdit && product) {
      reset({
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        categoryId: product.category,
        storeId: product.store._id,
        readyTime: product.readyTime,
        isActive: product.isActive,
        dietaryLabels: product.dietaryLabels.join(', '),
      })
      setImage(product.image ? resolveMediaUrl(product.image) : null)
      setCustomizationIds(product.customizations.map((c) => c._id))
    } else {
      reset({
        name: '',
        description: '',
        basePrice: 0,
        categoryId: '',
        storeId: '',
        readyTime: 5,
        isActive: true,
        dietaryLabels: '',
      })
      setImage(null)
      setCustomizationIds([])
    }
  }, [open, isEdit, product, reset])

  const buildPayload = (data: FormData): ProductFormDataPayload => ({
    store: data.storeId,
    category: data.categoryId,
    name: data.name,
    description: data.description,
    basePrice: data.basePrice,
    readyTime: data.readyTime,
    isActive: data.isActive,
    dietaryLabels: data.dietaryLabels
      ? data.dietaryLabels
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      : [],
    customizationIds: customizationIds.filter(Boolean),
  })

  const onSubmit = async (data: FormData) => {
    if (!isEdit && !(image instanceof File)) {
      toast({
        title: 'Image required',
        description: 'Please upload a product image.',
        variant: 'destructive',
      })
      return
    }

    const payload = buildPayload(data)

    try {
      if (isEdit && product) {
        await updateProduct({
          id: product._id,
          data: payload,
          image: image instanceof File ? image : undefined,
        }).unwrap()
        toast({ title: 'Updated', description: 'Product updated successfully.' })
      } else {
        await createProduct({
          data: payload,
          image: image as File,
        }).unwrap()
        toast({ title: 'Added', description: 'Product created successfully.' })
      }
      onClose()
    } catch {
      toast({
        title: 'Error',
        description: 'Could not save the product. Try again.',
        variant: 'destructive',
      })
    }
  }

  const listsLoading = shopsLoading || categoriesLoading || customizeLoading

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit product' : 'Add product'}
      size="xl"
      className="bg-white max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            label="Store"
            value={watchedStoreId}
            options={storeOptions}
            onChange={(v) => setValue('storeId', v)}
            placeholder={listsLoading ? 'Loading stores…' : 'Select store'}
            error={errors.storeId?.message}
            required
            disabled={listsLoading}
          />
          <FormSelect
            label="Category"
            value={watchedCategoryId}
            options={categoryOptions}
            onChange={(v) => setValue('categoryId', v)}
            placeholder={listsLoading ? 'Loading categories…' : 'Select category'}
            error={errors.categoryId?.message}
            required
            disabled={listsLoading}
          />
        </div>

        <FormInput
          label="Product name"
          placeholder="e.g. Double Espresso"
          error={errors.name?.message}
          required
          {...register('name')}
        />

        <FormTextarea
          label="Description"
          placeholder="Short description for customers"
          error={errors.description?.message}
          required
          rows={4}
          {...register('description')}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Base price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.basePrice?.message}
            required
            {...register('basePrice', { valueAsNumber: true })}
          />
          <FormInput
            label="Ready time (minutes)"
            type="number"
            min="1"
            placeholder="5"
            error={errors.readyTime?.message}
            required
            {...register('readyTime', { valueAsNumber: true })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Dietary labels"
            placeholder="e.g. Vegan, Gluten-Free (comma separated)"
            error={errors.dietaryLabels?.message}
            {...register('dietaryLabels')}
          />

          <FormMultiSelect
            label="Customization types"
            value={customizationIds}
            options={customizationSelectOptions}
            onChange={setCustomizationIds}
            placeholder={
              customizeLoading ? 'Loading…' : 'Select customization types (e.g. Flavour, Milk)'
            }
            disabled={listsLoading || customizeLoading}
            helperText="Selected IDs are sent as customizationIds."
            emptyMessage="No customization types found. Add them under Shop → Customise."
          />
        </div>

        {/* <div className="flex items-center gap-3 rounded-md border p-3">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} id="product-active" />
            )}
          />
          <label htmlFor="product-active" className="text-sm font-medium">
            Product is active {watchedIsActive ? '(visible)' : '(hidden)'}
          </label>
        </div> */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Image {!isEdit ? <span className="text-destructive">*</span> : null}
          </label>
      
          <ImageUploader
            value={image}
            onChange={(f) => setImage(f)}
            maxSize={MAX_IMAGE_SIZE}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || creating || updating}>
            {creating || updating ? 'Saving…' : isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
