import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Pagination } from '@/components/common'
import {
  useDeleteCustomizeMutation,
  useGetCustomizeQuery,
  useUpdateCustomizeMutation,
} from '@/redux/api/customizeApi'
import type { MilkType, SyrupType } from '@/types'
import { toast } from '@/utils/toast'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import { DEFAULT_PAGINATION } from '@/utils/constants'
import { AddEditMilkTypeModal } from './AddEditMilkTypeModal'
import { AddEditSyrupTypeModal } from './AddEditSyrupTypeModal'
import { ConfirmDialog } from '@/components/common'

function toMilkType(item: {
  _id: string
  name: string
  price: number
  status: boolean
  createdAt: string
  updatedAt: string
}): MilkType {
  return {
    id: item._id,
    name: item.name,
    price: item.price,
    type: 'milk',
    isActive: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

function toSyrupType(item: {
  _id: string
  name: string
  price: number
  status: boolean
  createdAt: string
  updatedAt: string
}): SyrupType {
  return {
    id: item._id,
    name: item.name,
    price: item.price,
    type: 'syrup',
    isActive: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

function MilkTypeTable({
  items,
  onEdit,
  onDelete,
  onToggle,
}: {
  items: MilkType[]
  onEdit: (m: MilkType) => void
  onDelete: (m: MilkType) => void
  onToggle: (m: MilkType) => void
}) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Price</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Type</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Created</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Updated</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No milk types yet. Add one to get started.
              </td>
            </tr>
          ) : (
            items.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{m.name}</td>
                <td className="px-6 py-4">{formatCurrency(m.price)}</td>
                <td className="px-6 py-4">
                  <span className="rounded-sm bg-secondary-foreground px-3 py-2 text-xs font-medium text-accent">
                    milk
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(m.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(m.updatedAt)}</td>
                <td className="px-6 py-4">
                  <Switch
                    checked={m.isActive}
                    onCheckedChange={() => onToggle(m)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(m)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(m)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function SyrupTypeTable({
  items,
  onEdit,
  onDelete,
  onToggle,
}: {
  items: SyrupType[]
  onEdit: (s: SyrupType) => void
  onDelete: (s: SyrupType) => void
  onToggle: (s: SyrupType) => void
}) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Price</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Type</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Created</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Updated</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No syrup types yet. Add one to get started.
              </td>
            </tr>
          ) : (
            items.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{s.name}</td>
                <td className="px-6 py-4">{formatCurrency(s.price)}</td>
                <td className="px-6 py-4">
                  <span className="rounded-sm bg-secondary-foreground px-3 py-2 text-xs font-medium text-accent">
                    syrup
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(s.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(s.updatedAt)}</td>
                <td className="px-6 py-4">
                  <Switch
                    checked={s.isActive}
                    onCheckedChange={() => onToggle(s)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(s)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(s)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function Customise() {
  const [milkPage, setMilkPage] = useState(1)
  const [milkLimit, setMilkLimit] = useState(DEFAULT_PAGINATION.limit)
  const [syrupPage, setSyrupPage] = useState(1)
  const [syrupLimit, setSyrupLimit] = useState(DEFAULT_PAGINATION.limit)

  const [updateCustomize] = useUpdateCustomizeMutation()
  const [deleteCustomize] = useDeleteCustomizeMutation()

  const {
    data: milkData,
    isLoading: isMilkLoading,
    isFetching: isMilkFetching,
  } = useGetCustomizeQuery({ page: milkPage, limit: milkLimit, type: 'milk' })
  console.log(milkData)

  const {
    data: syrupData,
    isLoading: isSyrupLoading,
    isFetching: isSyrupFetching,
  } = useGetCustomizeQuery({ page: syrupPage, limit: syrupLimit, type: 'syrup' })

  const milkTypes = useMemo(
    () => (milkData?.items ?? []).map(toMilkType),
    [milkData?.items],
  )
  const syrupTypes = useMemo(
    () => (syrupData?.items ?? []).map(toSyrupType),
    [syrupData?.items],
  )

  const [milkModalOpen, setMilkModalOpen] = useState(false)
  const [syrupModalOpen, setSyrupModalOpen] = useState(false)
  const [editingMilkId, setEditingMilkId] = useState<string | null>(null)
  const [editingSyrupId, setEditingSyrupId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<
    { type: 'milk'; item: MilkType } | { type: 'syrup'; item: SyrupType } | null
  >(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const selectedMilk = milkTypes.find((m) => m.id === editingMilkId) ?? null
  const selectedSyrup = syrupTypes.find((s) => s.id === editingSyrupId) ?? null

  const paginatedMilkTypes = milkTypes
  const paginatedSyrupTypes = syrupTypes

  const milkTotalPages = milkData?.pagination?.totalPage ?? 1
  const syrupTotalPages = syrupData?.pagination?.totalPage ?? 1

  const handleMilkPageChange = (page: number) => setMilkPage(page)
  const handleMilkLimitChange = (limit: number) => {
    setMilkLimit(limit)
    setMilkPage(1)
  }
  const handleSyrupPageChange = (page: number) => setSyrupPage(page)
  const handleSyrupLimitChange = (limit: number) => {
    setSyrupLimit(limit)
    setSyrupPage(1)
  }

  const handleAddMilk = () => {
    setEditingMilkId(null)
    setMilkModalOpen(true)
  }
  const handleEditMilk = (m: MilkType) => {
    setEditingMilkId(m.id)
    setMilkModalOpen(true)
  }
  const handleAddSyrup = () => {
    setEditingSyrupId(null)
    setSyrupModalOpen(true)
  }
  const handleEditSyrup = (s: SyrupType) => {
    setEditingSyrupId(s.id)
    setSyrupModalOpen(true)
  }

  const handleDelete = (type: 'milk' | 'syrup', item: MilkType | SyrupType) => {
    setDeleteTarget({ type, item } as typeof deleteTarget)
  }
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteCustomize({ id: deleteTarget.item.id }).unwrap()
      toast({
        title: 'Deleted',
        description:
          deleteTarget.type === 'milk'
            ? 'Milk type removed.'
            : 'Syrup type removed.',
      })
      setDeleteTarget(null)
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to delete. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
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
    
        <CardContent className="pt-6">
          <Tabs defaultValue="milk" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="milk">Milk Type</TabsTrigger>
              <TabsTrigger value="syrup">Syrup Type</TabsTrigger>
            </TabsList>
            <TabsContent value="milk" className=" space-y-4">
              <div className="flex justify-end">
                <Button onClick={handleAddMilk} className="bg-secondary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milk Type
                </Button>
              </div>
              <MilkTypeTable
                items={paginatedMilkTypes}
                onEdit={handleEditMilk}
                onDelete={(m) => handleDelete('milk', m)}
                onToggle={async (m) => {
                  try {
                    await updateCustomize({ id: m.id, status: !m.isActive }).unwrap()
                  } catch (e) {
                    toast({
                      title: 'Error',
                      description: 'Failed to update status. Please try again.',
                      variant: 'destructive',
                    })
                  }
                }}
              />
              <Pagination
                currentPage={milkPage}
                totalPages={milkTotalPages}
                totalItems={milkData?.pagination?.total ?? milkTypes.length}
                itemsPerPage={milkLimit}
                onPageChange={handleMilkPageChange}
                onItemsPerPageChange={handleMilkLimitChange}
              />
              {(isMilkLoading || isMilkFetching) && (
                <div className="text-sm text-gray-500">Loading milk types…</div>
              )}
            </TabsContent>
            <TabsContent value="syrup" className=" space-y-4">
              <div className="flex justify-end">
                <Button onClick={handleAddSyrup} className="bg-secondary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Syrup Type
                </Button>
              </div>
              <SyrupTypeTable
                items={paginatedSyrupTypes}
                onEdit={handleEditSyrup}
                onDelete={(s) => handleDelete('syrup', s)}
                onToggle={async (s) => {
                  try {
                    await updateCustomize({ id: s.id, status: !s.isActive }).unwrap()
                  } catch (e) {
                    toast({
                      title: 'Error',
                      description: 'Failed to update status. Please try again.',
                      variant: 'destructive',
                    })
                  }
                }}
              />
              <Pagination
                currentPage={syrupPage}
                totalPages={syrupTotalPages}
                totalItems={syrupData?.pagination?.total ?? syrupTypes.length}
                itemsPerPage={syrupLimit}
                onPageChange={handleSyrupPageChange}
                onItemsPerPageChange={handleSyrupLimitChange}
              />
              {(isSyrupLoading || isSyrupFetching) && (
                <div className="text-sm text-gray-500">Loading syrup types…</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddEditMilkTypeModal
        open={milkModalOpen}
        onClose={() => {
          setMilkModalOpen(false)
          setEditingMilkId(null)
        }}
        editingId={editingMilkId}
        milkType={selectedMilk}
      />
      <AddEditSyrupTypeModal
        open={syrupModalOpen}
        onClose={() => {
          setSyrupModalOpen(false)
          setEditingSyrupId(null)
        }}
        editingId={editingSyrupId}
        syrupType={selectedSyrup}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete"
        description={`Are you sure you want to delete "${deleteTarget?.item.name}"?`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </motion.div>
  )
}
