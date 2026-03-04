import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/common/Pagination'
import { ControllerTable } from './components/ControllerTable'
import { AddControllerModal } from './components/AddControllerModal'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setPage, setLimit } from '@/redux/slices/controllerSlice'
import { useUrlNumber } from '@/hooks/useUrlState'

export default function ControllerList() {
  const dispatch = useAppDispatch()
  const [showAddModal, setShowAddModal] = useState(false)

  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  const { filteredList, pagination } = useAppSelector((state) => state.controllers)

  useEffect(() => {
    dispatch(setPage(currentPage))
  }, [currentPage, dispatch])

  useEffect(() => {
    dispatch(setLimit(itemsPerPage))
  }, [itemsPerPage, dispatch])

  const totalPages = pagination.totalPages
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit
    return filteredList.slice(startIndex, startIndex + pagination.limit)
  }, [filteredList, pagination.page, pagination.limit])

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
          <ControllerTable controllers={paginatedData} />

          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              variant="revenue"
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

      <AddControllerModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </motion.div>
  )
}
