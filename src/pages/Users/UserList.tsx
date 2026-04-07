import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { UserFilterDropdown } from './components/UserFilterDropdown'
import { UserTable } from './components/UserTable'
import { UserDetailsModal } from './components/UserDetailsModal'
import {
  useGetCustomersQuery,
  useUserStatusChangeMutation,
} from '@/redux/api/userApi'
import { useUrlString, useUrlNumber } from '@/hooks/useUrlState'
import { toast } from '@/utils/toast'
import type { User, UserStatus } from '@/types'
import Loading from '@/components/common/Loading'

export default function UserList() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedViewUser, setSelectedViewUser] = useState<User | null>(null)

  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [userStatusUrl, setUserStatusUrl] = useUrlString('userStatus', 'all')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  /** Local search mirrors URL but updates reliably for RTK (not only after debounce→URL lag) */
  const [searchForApi, setSearchForApi] = useState(searchQuery)
  useEffect(() => {
    setSearchForApi(searchQuery)
  }, [searchQuery])

  /** Same for status filter — keeps Radix Select in sync with URL + API */
  const [statusForApi, setStatusForApi] = useState<UserStatus | 'all'>(() =>
    (userStatusUrl || 'all') as UserStatus | 'all'
  )
  useEffect(() => {
    setStatusForApi((userStatusUrl || 'all') as UserStatus | 'all')
  }, [userStatusUrl])

  const { data, isFetching, isError } = useGetCustomersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchForApi,
    status: statusForApi,
  })

  const [userStatusChange, { isLoading: isStatusMutating }] =
    useUserStatusChangeMutation()

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

  const prevStatusRef = useRef<string | null>(null)
  useEffect(() => {
    if (prevStatusRef.current === null) {
      prevStatusRef.current = userStatusUrl
      return
    }
    if (prevStatusRef.current !== userStatusUrl) {
      prevStatusRef.current = userStatusUrl
      setCurrentPage(1)
    }
  }, [userStatusUrl, setCurrentPage])

  const items = data?.items ?? []
  const pagination = data?.pagination
  const totalPages = Math.max(1, pagination?.totalPage ?? 1)
  const totalItems = pagination?.total ?? 0

  const handleView = (user: User) => {
    setSelectedViewUser(user)
    setIsViewModalOpen(true)
  }

  const handleLock = (user: User) => {
    setSelectedUser(user)
    setIsConfirmOpen(true)
  }

  const handleConfirmLock = async () => {
    if (!selectedUser) return

    const nextStatus =
      selectedUser.status === 'inactive' ? 'active' : 'inactive'

    try {
      await userStatusChange({
        id: selectedUser.id,
        status: nextStatus,
      }).unwrap()
      toast({
        title: 'Success',
        description: `${selectedUser.firstName} ${selectedUser.lastName} is now ${nextStatus}.`,
        variant: 'success',
      })
      setIsConfirmOpen(false)
      setSelectedUser(null)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update user status. Please try again.',
        variant: 'destructive',
      })
    }
  }

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

  const handleStatusChange = useCallback(
    (v: UserStatus | 'all') => {
      setStatusForApi(v)
      setUserStatusUrl(v)
      setCurrentPage(1)
    },
    [setUserStatusUrl, setCurrentPage]
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
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-xl font-bold text-slate-800">
            Users
          </CardTitle>
          <div className="flex items-center gap-3">
            <SearchInput
              value={searchForApi}
              onChange={handleSearchChange}
              placeholder="Search emailname"
              className="w-[300px]"
            />

            <UserFilterDropdown
              value={statusForApi}
              onChange={handleStatusChange}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {showInitialLoading ? (
            <Loading />
          ) : null}
          {isError && !isFetching ? (
            <div className="px-6 py-8 text-center text-sm text-red-600">
              Could not load users. Please try again.
            </div>
          ) : null}
          {!showInitialLoading && !isError ? (
            <UserTable
              users={items}
              onView={handleView}
              onLock={handleLock}
            />
          ) : null}

          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
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

      {selectedUser && (
        <ConfirmDialog
          open={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false)
            setSelectedUser(null)
          }}
          onConfirm={handleConfirmLock}
          title={
            selectedUser.status === 'inactive' ? 'Activate User' : 'Inactive User'
          }
          description={`Are you sure you want to ${
            selectedUser.status === 'inactive' ? 'activate' : 'inactive'
          } ${selectedUser.firstName} ${selectedUser.lastName}?`}
            variant={selectedUser.status === 'inactive' ? 'info' : 'warning'}
          confirmText={
            selectedUser.status === 'inactive' ? 'Activate' : 'Inactive User'
          }
          isLoading={isStatusMutating}
        />
      )}

      <UserDetailsModal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedViewUser(null)
        }}
        user={selectedViewUser}
      />
    </motion.div>
  )
}
