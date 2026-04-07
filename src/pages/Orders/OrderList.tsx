import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { OrderFilterDropdown } from './components/OrderFilterDropdown'
import { OrderTable } from './components/OrderTable'
import { ViewOrderDetailsModal } from './components/ViewOrderDetailsModal'
import { OrderStatusUpdateModal } from './components/OrderStatusUpdateModal'
import { useGetOrdersQuery } from '@/redux/api/ordersApi'
import { useUrlString, useUrlNumber } from '@/hooks/useUrlState'
import type { AdminOrder } from '@/redux/packageTypes/orders'
import { cn } from '@/utils/cn'
import Loading from '@/components/common/Loading'

export default function OrderList() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [statusFilter, setStatusFilter] = useUrlString('status', 'all')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  const skipFirstFilterReset = useRef(true)
  useEffect(() => {
    if (skipFirstFilterReset.current) {
      skipFirstFilterReset.current = false
      return
    }
    setCurrentPage(1)
  }, [searchQuery, statusFilter, setCurrentPage])

  const { data, isLoading, isFetching, isError, error } = useGetOrdersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    orderStatus: statusFilter,
  })

  const orders = data?.orders ?? []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPage ?? 1
  const totalItems = pagination?.total ?? 0
  const limit = pagination?.limit ?? itemsPerPage
  const page = pagination?.page ?? currentPage
  const startIndex = (page - 1) * limit

  const handleView = (order: AdminOrder) => {
    setSelectedOrder(order)
    setIsViewModalOpen(true)
  }

  const handleOpenStatus = (order: AdminOrder) => {
    setSelectedOrder(order)
    setIsStatusModalOpen(true)
  }

  const handlePageChange = (p: number) => {
    setCurrentPage(p)
  }

  const handleItemsPerPageChange = (next: number) => {
    setItemsPerPage(next)
    setCurrentPage(1)
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
              placeholder="Search order id or status…"
              className="w-[300px]"
            />
            <OrderFilterDropdown
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 relative">
          {isError && (
            <div className="px-6 py-4 text-sm text-red-600 border-b border-red-100 bg-red-50">
              Failed to load orders.
              {error && 'data' in error && (error.data as { message?: string })?.message
                ? ` ${(error.data as { message?: string }).message}`
                : ''}
            </div>
          )}
          <div
            className={cn(
              isFetching && !isLoading && 'opacity-70 pointer-events-none transition-opacity'
            )}
          >
            {isLoading ? (
              <Loading />
            ) : (
              <OrderTable
                orders={orders}
                startIndex={startIndex}
                onView={handleView}
                onUpdateStatus={handleOpenStatus}
              />
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={page}
              totalPages={Math.max(1, totalPages)}
              totalItems={totalItems}
              itemsPerPage={limit}
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

      <OrderStatusUpdateModal
        open={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setSelectedOrder(null)
        }}
        order={isStatusModalOpen ? selectedOrder : null}
      />
    </motion.div>
  )
}
