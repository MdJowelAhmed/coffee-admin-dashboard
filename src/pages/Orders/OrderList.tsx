import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { OrderFilterDropdown } from './components/OrderFilterDropdown'
import { OrderTable } from './components/OrderTable'
import { ViewOrderDetailsModal } from './components/ViewOrderDetailsModal'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setFilters, setPage, setLimit, deleteOrder } from '@/redux/slices/orderSlice'
import { useUrlString, useUrlNumber } from '@/hooks/useUrlState'
import { toast } from '@/utils/toast'
import type { Order, OrderStatus } from '@/types'

export default function OrderList() {
  const dispatch = useAppDispatch()

  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [statusFilter, setStatusFilter] = useUrlString('status', 'all')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  const { filteredList, pagination } = useAppSelector((state) => state.orders)
  const startIndex = (pagination.page - 1) * pagination.limit
  const paginatedData = filteredList.slice(
    startIndex,
    startIndex + pagination.limit
  )
  const totalPages = Math.ceil(filteredList.length / pagination.limit)

  useEffect(() => {
    dispatch(
      setFilters({
        search: searchQuery,
        status: statusFilter as OrderStatus | 'all',
      })
    )
  }, [searchQuery, statusFilter, dispatch])

  useEffect(() => {
    dispatch(setPage(currentPage))
  }, [currentPage, dispatch])

  useEffect(() => {
    dispatch(setLimit(itemsPerPage))
  }, [itemsPerPage, dispatch])

  const handleView = (order: Order) => {
    setSelectedOrder(order)
    setIsViewModalOpen(true)
  }

  const handleDelete = (order: Order) => {
    setOrderToDelete(order)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return

    setIsDeleting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      dispatch(deleteOrder(orderToDelete.id))
      toast({
        variant: 'success',
        title: 'Order Deleted',
        description: `Order ${orderToDelete.orderId} has been deleted successfully.`,
      })
      setIsConfirmOpen(false)
      setOrderToDelete(null)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete order. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit)
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
            Orders
          </CardTitle>
          <div className="flex items-center gap-3">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search ID or Status..."
              className="w-[300px]"
            />
            <OrderFilterDropdown
              value={statusFilter as OrderStatus | 'all'}
              onChange={setStatusFilter}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <OrderTable
            orders={paginatedData}
            onView={handleView}
            onDelete={handleDelete}
          />

          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={filteredList.length}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      <ViewOrderDetailsModal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
      />

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false)
          setOrderToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        description={`Are you sure you want to delete order "${orderToDelete?.orderId}"? This action cannot be undone.`}
        confirmText="Delete Order"
        variant="danger"
        isLoading={isDeleting}
      />
    </motion.div>
  )
}
