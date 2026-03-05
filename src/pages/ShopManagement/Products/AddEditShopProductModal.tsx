import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronDown } from 'lucide-react'
import { ModalWrapper, FormInput, FormSelect, ImageUploader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addShopProduct, updateShopProduct } from '@/redux/slices/shopProductSlice'
import type { ShopProduct, ShopProductMilkOrSyrup } from '@/types'
import type { SelectOption } from '@/types'
import { toast } from '@/utils/toast'

const schema = z.object({
  itemsName: z.string().min(1, 'Item name is required'),
  price: z.number().min(0, 'Price must be 0 or more'),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().min(0),
  pickupTime: z.string().min(1, 'Pickup time is required'),
})

type FormData = z.infer<typeof schema>

interface AddEditShopProductModalProps {
  open: boolean
  onClose: () => void
  editingId: string | null
  product: ShopProduct | null
}

function CustomizeMultiSelect({
  label,
  options,
  selected,
  onSelectionChange,
}: {
  label: string
  options: { id: string; name: string; price: number }[]
  selected: ShopProductMilkOrSyrup[]
  onSelectionChange: (items: ShopProductMilkOrSyrup[]) => void
}) {
  const selectedIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected])
  const displayText =
    selected.length > 0
      ? selected.map((s) => s.name).join(', ')
      : `Select ${label}...`

  const toggle = (item: { id: string; name: string; price: number }) => {
    if (selectedIds.has(item.id)) {
      onSelectionChange(selected.filter((s) => s.id !== item.id))
    } else {
      onSelectionChange([...selected, item])
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal h-11"
          >
            <span className="truncate text-left">
              {displayText}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">No options available</p>
          ) : (
            options.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.id}
                checked={selectedIds.has(opt.id)}
                onCheckedChange={() => toggle(opt)}
              >
                <span className="flex-1">{opt.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  +{opt.price.toFixed(2)}
                </span>
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function AddEditShopProductModal({
  open,
  onClose,
  editingId,
  product,
}: AddEditShopProductModalProps) {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((s) => s.shopCategories.list)
  const milkTypes = useAppSelector((s) => s.milkTypes.filteredList.filter((m) => m.isActive))
  const syrupTypes = useAppSelector((s) => s.syrupTypes.filteredList.filter((s) => s.isActive))

  const isEdit = !!editingId
  const [image, setImage] = useState<File | string | null>(null)
  const [selectedMilkTypes, setSelectedMilkTypes] = useState<ShopProductMilkOrSyrup[]>([])
  const [selectedSyrupTypes, setSelectedSyrupTypes] = useState<ShopProductMilkOrSyrup[]>([])

  const milkOptions = useMemo(
    () => milkTypes.map((m) => ({ id: m.id, name: m.name, price: m.price })),
    [milkTypes]
  )
  const syrupOptions = useMemo(
    () => syrupTypes.map((s) => ({ id: s.id, name: s.name, price: s.price })),
    [syrupTypes]
  )

  const categoryOptions: SelectOption[] = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories]
  )

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      itemsName: '',
      price: 0,
      categoryId: '',
      tags: '',
      pickupTime: '10:00',
    },
  })

  const watchedCategoryId = watch('categoryId')

  useEffect(() => {
    if (open) {
      if (isEdit && product) {
        reset({
          itemsName: product.itemsName,
          price: product.price,
          categoryId: product.categoryId,
          tags: product.tags.join(', '),
          pickupTime: product.pickupTime,
        })
        setImage(product.itemsPicture || null)
        setSelectedMilkTypes(product.milkTypes ?? [])
        setSelectedSyrupTypes(product.syrupTypes ?? [])
      } else {
        reset({
          itemsName: '',
          price: 0,
          categoryId: '',
          tags: '',
          pickupTime: '10:00',
        })
        setImage(null)
        setSelectedMilkTypes([])
        setSelectedSyrupTypes([])
      }
    }
  }, [open, isEdit, product, reset])

  const onSubmit = (data: FormData) => {
    const now = new Date().toISOString()
    const tags = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []
    const picture =
      typeof image === 'string' ? image : image ? URL.createObjectURL(image) : undefined
    const categoryName = categories.find((c) => c.id === data.categoryId)?.name ?? ''

    const payload: ShopProduct = {
      id: isEdit && product ? product.id : Date.now().toString(),
      itemsName: data.itemsName,
      price: data.price,
      categoryId: data.categoryId,
      categoryName,
      tags,
      customizeType: 'both',
      pickupTime: data.pickupTime,
      itemsPicture: picture,
      milkTypes: selectedMilkTypes,
      syrupTypes: selectedSyrupTypes,
      isActive: isEdit && product ? product.isActive : true,
      createdAt: isEdit && product ? product.createdAt : now,
      updatedAt: now,
    }
    if (isEdit) {
      dispatch(updateShopProduct(payload))
      toast({ title: 'Updated', description: 'Product updated successfully.' })
    } else {
      dispatch(addShopProduct(payload))
      toast({ title: 'Added', description: 'Product added successfully.' })
    }
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Product' : 'Add Product'}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Items Name"
          placeholder="Enter item name"
          error={errors.itemsName?.message}
          required
          {...register('itemsName')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <FormSelect
            label="Category"
            value={watchedCategoryId}
            options={categoryOptions}
            onChange={(v) => setValue('categoryId', v)}
            placeholder="Select category"
            error={errors.categoryId?.message}
            required
          />
        </div>

        <FormInput
          label="Tags"
          placeholder="e.g. hot, popular, new (comma separated)"
          error={errors.tags?.message}
          {...register('tags')}
        />

        <FormInput
          label="Pickup Time"
          type="time"
          error={errors.pickupTime?.message}
          required
          {...register('pickupTime')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomizeMultiSelect
            label="Milk Type"
            options={milkOptions}
            selected={selectedMilkTypes}
            onSelectionChange={setSelectedMilkTypes}
          />
          <CustomizeMultiSelect
            label="Syrup Type"
            options={syrupOptions}
            selected={selectedSyrupTypes}
            onSelectionChange={setSelectedSyrupTypes}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Items Picture</label>
          <ImageUploader value={image} onChange={(f) => setImage(f)} />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEdit ? 'Save' : 'Add'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
