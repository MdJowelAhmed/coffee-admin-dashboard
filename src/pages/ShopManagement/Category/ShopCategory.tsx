import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Pagination, ConfirmDialog } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { deleteShopCategory, toggleShopCategoryStatus } from '@/redux/slices/shopCategorySlice'
import type { ShopCategory } from '@/types'
import { toast } from '@/utils/toast'
import { DEFAULT_PAGINATION } from '@/utils/constants'
import { AddEditShopCategoryModal } from './AddEditShopCategoryModal'

function ShopCategoryTable({
  items,
  onEdit,
  onDelete,
  onToggle,
}: {
  items: ShopCategory[]
  onEdit: (c: ShopCategory) => void
  onDelete: (c: ShopCategory) => void
  onToggle: (c: ShopCategory) => void
}) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Short Description</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                No categories yet. Add one to get started.
              </td>
            </tr>
          ) : (
            items.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                  {c.shortDescription}
                </td>
                <td className="px-6 py-4">
                  <Switch
                    checked={c.isActive}
                    onCheckedChange={() => onToggle(c)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(c)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(c)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function ShopCategory() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((s) => s.shopCategories.filteredList)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGINATION.limit)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ShopCategory | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const selected = categories.find((c) => c.id === editingId) ?? null

  const paginatedCategories = useMemo(() => {
    const start = (page - 1) * limit
    return categories.slice(start, start + limit)
  }, [categories, page, limit])

  const totalPages = Math.ceil(categories.length / limit)

  const handlePageChange = (newPage: number) => setPage(newPage)
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }

  const handleAdd = () => {
    setEditingId(null)
    setModalOpen(true)
  }
  const handleEdit = (c: ShopCategory) => {
    setEditingId(c.id)
    setModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      dispatch(deleteShopCategory(deleteTarget.id))
      toast({ title: 'Deleted', description: 'Category removed.' })
      setDeleteTarget(null)
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
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">
              Shop Category
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage categories with name and short description
            </p>
          </div>
          <Button onClick={handleAdd} className="bg-primary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <ShopCategoryTable
            items={paginatedCategories}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
            onToggle={(c) => dispatch(toggleShopCategoryStatus(c.id))}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={categories.length}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleLimitChange}
          />
        </CardContent>
      </Card>

      <AddEditShopCategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingId(null)
        }}
        editingId={editingId}
        category={selected}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </motion.div>
  )
}
