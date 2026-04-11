import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Plus, CalendarOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Pagination, ConfirmDialog,  } from '@/components/common'
import type { Shop } from '@/types'
import { toast } from '@/utils/toast'
import { DEFAULT_PAGINATION } from '@/utils/constants'
import { AddEditShopModal } from './AddEditShopModal'
import {
  useGetShopsQuery,
  useDeleteShopMutation,
  useConnectStripeAccountMutation,
  useUpdateShopMutation,
} from '@/redux/api/shopManagementApi'
import { apiStoreToShop, shopToStoreDataPayload } from '@/redux/packageTypes/shop'
import Loading from '@/components/common/Loading'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const API_BASE = import.meta.env.VITE_API_BASE_URL

function mutationErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null && 'data' in err) {
    const data = (err as FetchBaseQueryError).data
    if (data && typeof data === 'object' && 'message' in data) {
      const msg = (data as { message?: unknown }).message
      if (typeof msg === 'string') return msg
    }
  }
  if (err instanceof Error) return err.message
  return fallback
}

function ShopCard({
  shop,
  onEdit,
  onDelete,
  onConnectStripe,
  onToggleActive,
  isTogglingActive,
}: {
  shop: Shop
  onEdit: (s: Shop) => void
  onDelete: (s: Shop) => void
  onConnectStripe: (s: Shop) => void
  onToggleActive: (s: Shop, isActive: boolean) => void
  isTogglingActive: boolean
}) {
  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-80 bg-gray-100">
        {shop.shopPicture ? (
          <img
            src={shop.shopPicture}
            alt={shop.shopName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Shop
          </div>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-2 rounded-md  px-2.5 py-1.5 backdrop-blur-sm">
          
          <Switch
            checked={shop.isActive}
            disabled={isTogglingActive}
            onCheckedChange={(checked) => onToggleActive(shop, checked)}
            aria-label={shop.isActive ? 'Set shop inactive' : 'Set shop active'}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base font-semibold text-slate-800 truncate">
          {shop.shopName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{shop.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4 flex-shrink-0" />
          <span>{shop.contact}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>
            {shop.openTime} - {shop.closeTime}
          </span>
        </div>
        {shop.offDay && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarOff className="h-4 w-4 flex-shrink-0" />
            <span>Off: {shop.offDay}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {shop.aboutShop}
        </p>
        <div className="flex gap-2 pt-3 border-t mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(shop)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 hover:text-red-700 hover:border-red-200"
            onClick={() => onDelete(shop)}
          >
            Delete
          </Button>
          {!shop.isConnectedAccountReady && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-secondary hover:border-secondary/40"
              onClick={() => onConnectStripe(shop)}
            >
              Connect Stripe
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ShopList() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGINATION.limit)
  // const [searchTerm, setSearchTerm] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Shop | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [deleteShop, { isLoading: isDeleteLoading }] = useDeleteShopMutation()
  const [connectStripeAccount] = useConnectStripeAccountMutation()
  const [updateShop] = useUpdateShopMutation()
  const [togglingActiveId, setTogglingActiveId] = useState<string | null>(null)

  const { data, isLoading, isFetching, error } = useGetShopsQuery({
    page,
    limit,
    // searchTerm: searchTerm.trim() || undefined,
  })

  const shops: Shop[] = useMemo(
    () => (data?.items ?? []).map((item) => apiStoreToShop(item, API_BASE)),
    [data?.items]
  )

  const selected = shops.find((s) => s.id === editingId) ?? null

  const pagination = data?.pagination
  const totalItems = pagination?.total ?? 0
  const totalPages = pagination?.totalPage ?? Math.max(1, Math.ceil(totalItems / limit))

  const handlePageChange = (newPage: number) => setPage(newPage)
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }

  const handleAdd = () => {
    setEditingId(null)
    setModalOpen(true)
  }
  const handleEdit = (s: Shop) => {
    setEditingId(s.id)
    setModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteShop({ id: deleteTarget.id }).unwrap()
      toast({ title: 'Deleted', description: 'Shop removed.' })
      setDeleteTarget(null)
    } catch {
      toast({
        title: 'Delete failed',
        description: 'Could not delete the shop.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleActive = async (shop: Shop, isActive: boolean) => {
    setTogglingActiveId(shop.id)
    try {
      await updateShop({
        id: shop.id,
        data: shopToStoreDataPayload(shop, { isActive }),
      }).unwrap()
      toast({
        title: 'Updated',
        description: isActive ? 'Shop is now active.' : 'Shop is now inactive.',
      })
    } catch (err) {
      toast({
        title: 'Status update failed',
        description: mutationErrorMessage(
          err,
          'Could not change shop status. Try again.',
        ),
        variant: 'destructive',
      })
    } finally {
      setTogglingActiveId(null)
    }
  }

  const handleConnectStripe = async (shop: Shop) => {
    try {
      const res = (await connectStripeAccount({ id: shop.id }).unwrap()) as {
        success?: boolean
        message?: string
        data?: { url?: string }
      }
      const url = res?.data?.url
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
        toast({ title: 'Stripe', description: 'Open Stripe onboarding in a new tab.' })
      } else {
        toast({
          title: 'Stripe',
          description: 'Connected, but no onboarding URL returned.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Stripe connect failed',
        description: 'Could not start Stripe onboarding. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const listBusy = isLoading || isFetching

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="space-y-6"
    >
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">
              Shops
            </CardTitle>
            {/* <p className="text-sm text-muted-foreground mt-1">
              Manage stores: name, contact, address, hours, and image
            </p> */}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* <SearchInput
              value={searchTerm}
              onChange={(v) => {
                setSearchTerm(v)
                setPage(1)
              }}
              placeholder="Search shops…"
              debounceMs={400}
              className="w-[200px] md:w-[260px]"
            /> */}
            <Button onClick={handleAdd} className="bg-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Shop
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Failed to load shops. Check the API URL and your session.
            </div>
          )}
          {listBusy && !data ? (
            <Loading />
          ) : shops.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No shops found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {shops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                  onConnectStripe={handleConnectStripe}
                  onToggleActive={handleToggleActive}
                  isTogglingActive={togglingActiveId === shop.id}
                />
              ))}
            </div>
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleLimitChange}
          />
        </CardContent>
      </Card>

      <AddEditShopModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingId(null)
        }}
        editingId={editingId}
        shop={selected}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !isDeleting && !isDeleteLoading && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Shop"
        description={`Are you sure you want to delete "${deleteTarget?.shopName}"?`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting || isDeleteLoading}
      />
    </motion.div>
  )
}
