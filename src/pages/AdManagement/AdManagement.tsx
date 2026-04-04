import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { AddPosterModal } from './components/AddPosterModal'
import { DeletePosterModal } from './components/DeletePosterModal'
import { PosterCard } from './components/PosterCard'
import {
  useGetPromotionsQuery,
  useDeletePromotionMutation,
} from '@/redux/api/adManagerApi'
import { useUrlNumber, useUrlString } from '@/hooks/useUrlState'
import type { Poster } from '@/types'
import { ITEMS_PER_PAGE_OPTIONS } from '@/utils/constants'
import { toast } from '@/utils/toast'

export default function AdManagement() {
  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber(
    'limit',
    ITEMS_PER_PAGE_OPTIONS[0]
  )

  const [searchForApi, setSearchForApi] = useState(searchQuery)
  useEffect(() => {
    setSearchForApi(searchQuery)
  }, [searchQuery])

  const { data, isFetching, isError } = useGetPromotionsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchForApi,
  })

  const [deletePromotion, { isLoading: isDeleting }] =
    useDeletePromotionMutation()

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

  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null)

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

  const handleDeleteClick = (poster: Poster) => {
    setSelectedPoster(poster)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedPoster) return
    try {
      await deletePromotion(selectedPoster.id).unwrap()
      toast({
        title: 'Deleted',
        description: 'Promotion removed.',
        variant: 'success',
      })
      setSelectedPoster(null)
      setShowDeleteModal(false)
    } catch {
      toast({
        title: 'Error',
        description: 'Could not delete promotion. Check the API or try again.',
        variant: 'destructive',
      })
    }
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
        <CardHeader className="flex flex-row items-center justify-between pb-6 flex-wrap gap-4">
          <CardTitle className="text-xl font-bold text-slate-800">
            Ad Management
          </CardTitle>
          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              value={searchForApi}
              onChange={handleSearchChange}
              placeholder="Search promotions..."
              className="w-[260px]"
            />
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Poster
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showInitialLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading promotions...
            </div>
          ) : null}
          {isError && !isFetching ? (
            <div className="py-16 text-center text-sm text-red-600">
              Could not load promotions. Please try again.
            </div>
          ) : null}
          {!showInitialLoading && !isError && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg bg-muted/30">
              <p className="text-muted-foreground mb-4">
                No promotions yet. Add your first poster to get started.
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Poster
              </Button>
            </div>
          ) : null}
          {!showInitialLoading && !isError && items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((poster) => (
                  <PosterCard
                    key={poster.id}
                    poster={poster}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>

              <div className="mt-6 border-t pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <AddPosterModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {selectedPoster ? (
        <DeletePosterModal
          open={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedPoster(null)
          }}
          poster={selectedPoster}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      ) : null}
    </motion.div>
  )
}
