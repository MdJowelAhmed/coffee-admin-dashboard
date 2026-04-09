import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pagination, ConfirmDialog } from '@/components/common'
import { ControllerTable } from './components/ControllerTable'
import { AddControllerModal } from './components/AddControllerModal'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setControllers, setPage, setLimit } from '@/redux/slices/controllerSlice'
import { useUrlNumber } from '@/hooks/useUrlState'
import {
  useDeleteControllerMutation,
  useGetControllersQuery,
  useUpdateControllerStatusMutation,
} from '@/redux/api/controllersApi'
import type { Controller } from '@/types'

export default function ControllerList() {
  const dispatch = useAppDispatch()
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Controller | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  const { filteredList, pagination } = useAppSelector((state) => state.controllers)

  const [updateStatus] = useUpdateControllerStatusMutation()
  const [deleteController] = useDeleteControllerMutation()

  const { data } = useGetControllersQuery({
    page: currentPage,
    limit: itemsPerPage,
  })

  useEffect(() => {
    dispatch(setPage(currentPage))
  }, [currentPage, dispatch])

  useEffect(() => {
    dispatch(setLimit(itemsPerPage))
  }, [itemsPerPage, dispatch])

  useEffect(() => {
    if (data) {
      dispatch(setControllers(data))
    }
  }, [data, dispatch])

  const totalPages = pagination.totalPage
  const paginatedData = useMemo(() => {
    // Server already paginates; keep UI compatible with existing slice shape.
    return filteredList
  }, [filteredList])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit)
  }

  const handleToggleStatus = async (c: Controller, nextActive: boolean) => {
    setTogglingId(c.id)
    try {
      await updateStatus({
        id: c.id,
        status: nextActive ? 'active' : 'inactive',
      }).unwrap()
    } finally {
      setTogglingId(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setDeletingId(deleteTarget.id)
    try {
      await deleteController({ id: deleteTarget.id }).unwrap()
      setDeleteTarget(null)
    } finally {
      setDeletingId(null)
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
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-xl font-bold text-slate-800">
            Super Admin Controllers
          </CardTitle>
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Controller
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <ControllerTable
            controllers={paginatedData}
            onToggleStatus={handleToggleStatus}
            onDelete={setDeleteTarget}
            isTogglingId={togglingId}
            isDeletingId={deletingId}
          />

          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              variant="revenue"
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      <AddControllerModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deletingId && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Controller"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete"
        variant="danger"
        isLoading={!!deletingId}
      />
    </motion.div>
  )
}
