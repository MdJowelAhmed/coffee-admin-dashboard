import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { RevenueTable } from './components/RevenueTable'
import { useGetRevenueQuery } from '@/redux/api/revenueApi'
import { useUrlString, useUrlNumber } from '@/hooks/useUrlState'
import Loading from '@/components/common/Loading'

export default function RevenueList() {
  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  const { data, isFetching, isError } = useGetRevenueQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  })

  const prevSearchRef = useRef<string | null>(null)
  useEffect(() => {
    if (prevSearchRef.current === null) {
      prevSearchRef.current = searchQuery
      return
    }
    if (prevSearchRef.current !== searchQuery) {
      prevSearchRef.current = searchQuery
      setCurrentPage(1)
    }
  }, [searchQuery, setCurrentPage])

  const items = data?.items ?? []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPage ?? 1
  const totalItems = pagination?.total ?? 0

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit)
    setCurrentPage(1)
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
            placeholder="Search order ID, status..."
            className="w-[280px]"
          />
        </CardHeader>

        <CardContent className="p-0">
          {isFetching && (
            <Loading />
          )}
          {isError && !isFetching ? (
            <div className="px-6 py-8 text-center text-sm text-red-600">
              Could not load revenue. Please try again.
            </div>
          ) : null}
          {!isFetching && items.length === 0 ? (
            <RevenueTable items={items} />
          ) : null}

          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
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
