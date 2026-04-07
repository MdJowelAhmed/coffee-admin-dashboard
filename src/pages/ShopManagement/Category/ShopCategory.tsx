import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Pagination, ConfirmDialog } from '@/components/common'
import { toast } from '@/utils/toast'
import { DEFAULT_PAGINATION } from '@/utils/constants'
import { AddEditShopCategoryModal } from './AddEditShopCategoryModal'
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '@/redux/api/CategoryApi'
import type { Category } from '@/redux/packageTypes/category'
import Loading from '@/components/common/Loading'

function formatDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

function ShopCategoryTable({
  items,
  onEdit,
  onDelete,
  onToggle,
}: {
  items: Category[]
  onEdit: (c: Category) => void
  onDelete: (c: Category) => void
  onToggle: (c: Category) => void
}) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Created</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Updated</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                No categories yet. Add one to get started.
              </td>
            </tr>
          ) : (
            items.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatDateTime(c.createdAt)}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatDateTime(c.updatedAt)}
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
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGINATION.limit)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data, isFetching } = useGetCategoriesQuery({ page, limit })
  const [deleteCategory] = useDeleteCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()

  const categories = data?.items ?? []
  const selected = categories.find((c) => c.id === editingId) ?? null
  const totalPages = data?.pagination?.totalPage ?? 1
  const totalItems = data?.pagination?.total ?? categories.length

  const handlePageChange = (newPage: number) => setPage(newPage)
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }

  const handleAdd = () => {
    setEditingId(null)
    setModalOpen(true)
  }
  const handleEdit = (c: Category) => {
    setEditingId(c.id)
    setModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteCategory({ id: deleteTarget.id }).unwrap()
      toast({ title: 'Deleted', description: 'Category removed.' })
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async (c: Category) => {
    await updateCategory({ id: c.id, isActive: !c.isActive }).unwrap()
    toast({
      title: 'Updated',
      description: `Category is now ${!c.isActive ? 'active' : 'inactive'}.`,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="space-y-6"
    >
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">
              Shop Category
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage categories (name, status, created/updated time)
            </p>
          </div>
          <Button onClick={handleAdd} className="bg-primary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
            {isFetching && (
              <Loading />
            )}
          <ShopCategoryTable
            items={categories}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
            onToggle={handleToggleStatus}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
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
