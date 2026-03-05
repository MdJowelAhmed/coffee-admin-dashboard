import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/common/Pagination'
import { AddPosterModal } from './components/AddPosterModal'
import { DeletePosterModal } from './components/DeletePosterModal'
import { PosterCard } from './components/PosterCard'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setPage,
  setLimit,
  deletePoster,
} from '@/redux/slices/adSlice'
import { useUrlNumber } from '@/hooks/useUrlState'
import type { Poster } from '@/types'
import { ITEMS_PER_PAGE_OPTIONS } from '@/utils/constants'

export default function AdManagement() {
  const dispatch = useAppDispatch()
  const { list, pagination } = useAppSelector((state) => state.ads)

  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', ITEMS_PER_PAGE_OPTIONS[0])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null)

  useEffect(() => {
    dispatch(setPage(currentPage))
  }, [currentPage, dispatch])

  useEffect(() => {
    dispatch(setLimit(itemsPerPage))
  }, [itemsPerPage, dispatch])

  const totalPages = Math.max(1, Math.ceil(list.length / itemsPerPage))
  const paginatedList = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit
    return list.slice(start, start + pagination.limit)
  }, [list, pagination.page, pagination.limit])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit)
    setCurrentPage(1)
  }

  const handleDeleteClick = (poster: Poster) => {
    setSelectedPoster(poster)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (selectedPoster) {
      dispatch(deletePoster(selectedPoster.id))
      setSelectedPoster(null)
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
            Ad Management
          </CardTitle>
          <Button
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Poster
          </Button>
        </CardHeader>

        <CardContent>
          {paginatedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg bg-muted/30">
              <p className="text-muted-foreground mb-4">
                No posters yet. Add your first poster to get started.
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Poster
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedList.map((poster) => (
                  <PosterCard
                    key={poster.id}
                    poster={poster}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>

              <div className="mt-6 border-t pt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  totalItems={list.length}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AddPosterModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {selectedPoster && (
        <DeletePosterModal
          open={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedPoster(null)
          }}
          poster={selectedPoster}
          onConfirm={handleConfirmDelete}
        />
      )}
    </motion.div>
  )
}
