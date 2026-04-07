import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Clock, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Pagination, ConfirmDialog } from '@/components/common'
import { useGetCategoriesQuery } from '@/redux/api/CategoryApi'
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from '@/redux/api/productsApi'
import type { ApiProduct, ProductFormDataPayload } from '@/redux/packageTypes/products'
import { toast } from '@/utils/toast'
import { formatCurrency, resolveMediaUrl } from '@/utils/formatters'
import { DEFAULT_PAGINATION } from '@/utils/constants'
import { AddEditShopProductModal } from './AddEditShopProductModal'

function apiProductToPayload(
  p: ApiProduct,
  overrides?: Partial<ProductFormDataPayload>,
): ProductFormDataPayload {
  return {
    store: p.store._id,
    category: p.category,
    name: p.name,
    description: p.description,
    basePrice: p.basePrice,
    readyTime: p.readyTime,
    isActive: p.isActive,
    dietaryLabels: [...p.dietaryLabels],
    customizationIds: p.customizations.map((c) => c._id),
    ...overrides,
  }
}

function ProductCard({
  product,
  categoryName,
  onEdit,
  onDelete,
  onToggle,
}: {
  product: ApiProduct
  categoryName: string
  onEdit: (p: ApiProduct) => void
  onDelete: (p: ApiProduct) => void
  onToggle: (p: ApiProduct) => void
}) {
  const customLabels =
    product.customizations?.map((c) => c.name).join(', ') || '—'
  const imgSrc = resolveMediaUrl(product.image)

  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-36 bg-muted">
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Switch checked={product.isActive} onCheckedChange={() => onToggle(product)} />
        </div>
      </div>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="truncate text-base font-semibold text-slate-800">
          {product.name}
        </CardTitle>
        <p className="text-sm font-medium text-primary">{formatCurrency(product.basePrice)}</p>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <p className="text-sm text-muted-foreground">{categoryName || '—'}</p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Store:</span> {product.store?.name ?? '—'}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>Ready: {product.readyTime} min</span>
        </div>
        {product.dietaryLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.dietaryLabels.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded bg-secondary-foreground px-2 py-0.5 text-xs text-accent"
              >
                <Tag className="h-3 w-3" />
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="space-y-1 pt-1 text-xs text-muted-foreground">
          <p>
            <span className="font-medium">Customizations:</span> {customLabels}
          </p>
        </div>
        <div className="mt-3 flex gap-2 border-t pt-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(product)}>
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 hover:border-red-200 hover:text-red-700"
            onClick={() => onDelete(product)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ShopProducts() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGINATION.limit)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApiProduct | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: productsData, isLoading, isFetching } = useGetProductsQuery({ page, limit })
  const { data: categoriesData } = useGetCategoriesQuery({ page: 1, limit: 500 })

  const [deleteProduct] = useDeleteProductMutation()
  const [updateProduct] = useUpdateProductMutation()

  const items = productsData?.items ?? []
  const totalPages = productsData?.pagination?.totalPage ?? 1
  const totalItems = productsData?.pagination?.total ?? 0

  const categoryNameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const c of categoriesData?.items ?? []) {
      m.set(c.id, c.name)
    }
    return m
  }, [categoriesData?.items])

  const selected = items.find((p) => p._id === editingId) ?? null

  const handlePageChange = (newPage: number) => setPage(newPage)
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }

  const handleAdd = () => {
    setEditingId(null)
    setModalOpen(true)
  }
  const handleEdit = (p: ApiProduct) => {
    setEditingId(p._id)
    setModalOpen(true)
  }

  const handleToggle = async (p: ApiProduct) => {
    try {
      await updateProduct({
        id: p._id,
        data: apiProductToPayload(p, { isActive: !p.isActive }),
      }).unwrap()
      toast({ title: 'Updated', description: 'Product status saved.' })
    } catch {
      toast({
        title: 'Error',
        description: 'Could not update status.',
        variant: 'destructive',
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteProduct({ id: deleteTarget._id }).unwrap()
      toast({ title: 'Deleted', description: 'Product removed.' })
      setDeleteTarget(null)
    } catch {
      toast({
        title: 'Error',
        description: 'Could not delete product.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="border-0 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">Shop products</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and edit products with multipart <code className="text-xs">data</code> +{' '}
              <code className="text-xs">image</code>; link customization types by ID.
            </p>
          </div>
          <Button onClick={handleAdd} className="bg-primary text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add product
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Loading products…</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No products yet. Add one to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  categoryName={categoryNameById.get(product.category) ?? ''}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
          {items.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleLimitChange}
            />
          )}
          {isFetching && !isLoading && (
            <div className="text-sm text-muted-foreground">Refreshing…</div>
          )}
        </CardContent>
      </Card>

      <AddEditShopProductModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingId(null)
        }}
        editingId={editingId}
        product={selected}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </motion.div>
  )
}
