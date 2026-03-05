import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { RevenueTable } from './components/RevenueTable'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setFilters, setPage, setLimit } from '@/redux/slices/transactionSlice'
import { useUrlString, useUrlNumber } from '@/hooks/useUrlState'

export default function RevenueList() {
  const dispatch = useAppDispatch()

  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  const { filteredList, pagination } = useAppSelector(
    (state) => state.transactions
  )

  useEffect(() => {
    dispatch(
      setFilters({
        search: searchQuery,
        status: 'all',
      })
    )
  }, [searchQuery, dispatch])

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
      <Card className="bg-white border-0 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-xl font-bold text-slate-800">
            Revenue List
          </CardTitle>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search ID, Status..."
            className="w-[280px]"
          />
        </CardHeader>

        <CardContent className="p-0">
          <RevenueTable transactions={paginatedData} />

          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={filteredList.length}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              variant="revenue"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
