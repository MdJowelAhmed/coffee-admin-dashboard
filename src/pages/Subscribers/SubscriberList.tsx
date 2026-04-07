import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { SubscriberTable } from './components/SubscriberTable'
import { WriteMailModal } from './components/WriteMailModal'
import {
  useGetSubscribersQuery,
  useSendSubscriberEmailMutation,
} from '@/redux/api/subscriberUserApi'
import { useUrlString, useUrlNumber } from '@/hooks/useUrlState'
import { toast } from '@/utils/toast'
import type { SendMailPayload } from '@/types'
import Loading from '@/components/common/Loading'

export default function SubscriberList() {
  const [showWriteMail, setShowWriteMail] = useState(false)

  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  const [searchForApi, setSearchForApi] = useState(searchQuery)
  useEffect(() => {
    setSearchForApi(searchQuery)
  }, [searchQuery])

  const { data, isFetching, isError } = useGetSubscribersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchForApi,
  })

  const [sendSubscriberEmail, { isLoading: isSendingMail }] =
    useSendSubscriberEmailMutation()

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
  const totalPages = Math.max(1, pagination?.totalPage ?? 1)
  const totalItems = pagination?.total ?? 0

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit)
    setCurrentPage(1)
  }

  const handleSearchChange = useCallback(
    (v: string) => {
      setSearchForApi(v)
      setSearchQuery(v)
      setCurrentPage(1)
    },
    [setSearchQuery, setCurrentPage]
  )

  const handleMailSent = async (payload: SendMailPayload) => {
    await sendSubscriberEmail(payload).unwrap()
    toast({
      title: 'Success',
      description: 'Message scheduled for subscribers.',
      variant: 'success',
    })
  }

  const showInitialLoading = isFetching && items.length === 0

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
            Subscribers
          </CardTitle>
          <div className="flex items-center gap-3">
            <SearchInput
              value={searchForApi}
              onChange={handleSearchChange}
              placeholder="Search email..."
              className="w-[300px]"
            />

            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => setShowWriteMail(true)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send a Message
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {showInitialLoading ? (
            <Loading />
          ) : null}
          {isError && !isFetching ? (
            <div className="px-6 py-8 text-center text-sm text-red-600">
              Could not load subscribers. Please try again.
            </div>
          ) : null}
          {!showInitialLoading && !isError ? (
            <SubscriberTable subscribers={items} />
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

      <WriteMailModal
        open={showWriteMail}
        onClose={() => setShowWriteMail(false)}
        onSent={handleMailSent}
        isSending={isSendingMail}
      />
    </motion.div>
  )
}
