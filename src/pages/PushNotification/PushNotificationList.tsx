import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { NotificationTable } from './components/NotificationTable'
import { NotificationFilterDropdown } from './components/NotificationFilterDropdown'
import { SendNotificationModal } from './components/SendNotificationModal'
import { useGetPushNotificationsQuery } from '@/redux/api/pushNotificationApi'
import { useUrlString, useUrlNumber, useUrlParams } from '@/hooks/useUrlState'
import Loading from '@/components/common/Loading'

export default function PushNotificationList() {
  const [showSendModal, setShowSendModal] = useState(false)
  const { setParams } = useUrlParams()

  const [searchQuery] = useUrlString('search', '')
  const [typeFilter] = useUrlString('type', 'all')
  const [readFilter] = useUrlString('read', 'all')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage] = useUrlNumber('limit', 10)

  const [searchTermForApi, setSearchTermForApi] = useState(searchQuery)
  useEffect(() => {
    setSearchTermForApi(searchQuery)
  }, [searchQuery])

  /** Maps UI read filter to boolean for backend `isRead` query param */
  const isReadForApi = useMemo(() => {
    if (readFilter === 'Read') return true
    if (readFilter === 'Unread') return false
    return undefined
  }, [readFilter])

  const { data, isFetching, isError } = useGetPushNotificationsQuery({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchTermForApi,
    /** API values: ORDER | PAYMENT | PROMOTION | SYSTEM | DAILY_SPECIAL | NEW_DRINK */
    type: typeFilter,
    isRead: isReadForApi,
  })

  const items = data?.items ?? []
  const pagination = data?.pagination
  const totalPages = Math.max(1, pagination?.totalPage ?? 1)
  const totalItems = pagination?.total ?? 0

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (limit: number) => {
    setParams({ limit, page: 1 })
  }

  const handleSearchChange = useCallback(
    (v: string) => {
      setSearchTermForApi(v)
      setParams({
        search: v.trim() === '' ? null : v,
        page: 1,
      })
    },
    [setParams]
  )

  const handleTypeFilterChange = useCallback(
    (v: string) => {
      setParams({
        type: v === 'all' ? null : v,
        page: 1,
      })
    },
    [setParams]
  )

  const handleReadFilterChange = useCallback(
    (v: string) => {
      setParams({
        read: v === 'all' ? null : v,
        page: 1,
      })
    },
    [setParams]
  )

  const showInitialLoading = isFetching && items.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-6 flex-wrap gap-4">
          <CardTitle className="text-xl font-bold text-slate-800">
            Push Notifications
          </CardTitle>
          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              value={searchTermForApi}
              onChange={handleSearchChange}
              placeholder="Search title, message, receiver..."
              className="w-[280px]"
            />

            <NotificationFilterDropdown
              typeValue={typeFilter}
              readValue={readFilter}
              onTypeChange={handleTypeFilterChange}
              onReadChange={handleReadFilterChange}
            />

            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => setShowSendModal(true)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Send a Notification
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {showInitialLoading ? (
            <Loading />
          ) : null}
          {isError && !isFetching ? (
            <div className="px-6 py-8 text-center text-sm text-red-600">
              Could not load notifications. Please try again.
            </div>
          ) : null}
          {!showInitialLoading && !isError ? (
            <NotificationTable notifications={items} />
          ) : null}

          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              variant="revenue"
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      <SendNotificationModal
        open={showSendModal}
        onClose={() => setShowSendModal(false)}
      />
    </motion.div>
  )
}
