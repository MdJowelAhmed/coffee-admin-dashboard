import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Pagination } from '@/components/common'
import {
  useDeleteCustomizeMutation,
  useDeleteCustomizeOptionMutation,
  useGetCustomizeQuery,
  useUpdateCustomizeMutation,
} from '@/redux/api/customizeApi'
import type {
  ApiCustomizeItem,
  ApiCustomizeOption,
} from '@/redux/packageTypes/customize'
import { toast } from '@/utils/toast'
import { formatCurrency } from '@/utils/formatters'
import { DEFAULT_PAGINATION } from '@/utils/constants'
import { AddEditCustomizationTypeModal } from './AddEditCustomizationTypeModal'
import { AddEditCustomizationOptionModal } from './AddEditCustomizationOptionModal'
import { ConfirmDialog } from '@/components/common'

type DeleteTarget =
  | { kind: 'category'; item: ApiCustomizeItem }
  | { kind: 'option'; categoryId: string; categoryName: string; option: ApiCustomizeOption }

function OptionsTable({
  options,
  categoryName,
  onEdit,
  onDelete,
}: {
  options: ApiCustomizeOption[]
  categoryName: string
  onEdit: (opt: ApiCustomizeOption) => void
  onDelete: (opt: ApiCustomizeOption) => void
}) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">Label</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Price</th>
            <th className="px-6 py-4 text-right text-sm font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {options.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                No options yet for “{categoryName}”. Add one below.
              </td>
            </tr>
          ) : (
            options.map((opt) => (
              <tr key={opt._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{opt.label}</td>
                <td className="px-6 py-4">{formatCurrency(opt.price)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(opt)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(opt)}
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
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGINATION.limit)
  const [activeTab, setActiveTab] = useState<string>('')

  const [updateCustomize] = useUpdateCustomizeMutation()
  const [deleteCustomize] = useDeleteCustomizeMutation()
  const [deleteOption] = useDeleteCustomizeOptionMutation()

  const { data, isLoading, isFetching } = useGetCustomizeQuery({ page, limit })

  const items = useMemo(() => data?.items ?? [], [data?.items])
  const totalPages = data?.pagination?.totalPage ?? 1

  useEffect(() => {
    if (items.length === 0) {
      setActiveTab('')
      return
    }
    const exists = items.some((i) => i._id === activeTab)
    if (!activeTab || !exists) {
      setActiveTab(items[0]._id)
    }
  }, [items, activeTab])

  const [typeModalOpen, setTypeModalOpen] = useState(false)
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null)

  const [optionModalOpen, setOptionModalOpen] = useState(false)
  const [optionContextId, setOptionContextId] = useState<string | null>(null)
  const [optionCategoryName, setOptionCategoryName] = useState('')
  const [editingOption, setEditingOption] = useState<ApiCustomizeOption | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const selectedCategoryForTypeModal =
    items.find((i) => i._id === editingTypeId) ?? null

  const handlePageChange = (p: number) => setPage(p)
  const handleLimitChange = (l: number) => {
    setLimit(l)
    setPage(1)
  }

  const handleAddType = () => {
    setEditingTypeId(null)
    setTypeModalOpen(true)
  }

  const handleEditType = (item: ApiCustomizeItem) => {
    setEditingTypeId(item._id)
    setTypeModalOpen(true)
  }

  const handleAddOption = (item: ApiCustomizeItem) => {
    setEditingOption(null)
    setOptionContextId(item._id)
    setOptionCategoryName(item.name)
    setOptionModalOpen(true)
  }

  const handleEditOption = (category: ApiCustomizeItem, opt: ApiCustomizeOption) => {
    setEditingOption(opt)
    setOptionContextId(category._id)
    setOptionCategoryName(category.name)
    setOptionModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      if (deleteTarget.kind === 'category') {
        await deleteCustomize({ id: deleteTarget.item._id }).unwrap()
        toast({ title: 'Deleted', description: 'Customization type removed.' })
      } else {
        await deleteOption({
          id: deleteTarget.categoryId,
          optionId: deleteTarget.option._id,
        }).unwrap()
        toast({ title: 'Deleted', description: 'Option removed.' })
      }
      setDeleteTarget(null)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const deleteDescription =
    deleteTarget?.kind === 'category'
      ? `Are you sure you want to delete the type "${deleteTarget.item.name}" and all of its options?`
      : `Are you sure you want to delete the option "${deleteTarget?.kind === 'option' ? deleteTarget.option.label : ''}"?`

  const showEmpty = !isLoading && items.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="border-0 bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              Tabs match customization types from your API. Add types, then add options under each type.
            </p>
            <Button onClick={handleAddType} className="bg-secondary text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add customization type
            </Button>
          </div>

          {showEmpty ? (
            <div className="rounded-lg border border-dashed border-gray-200 py-16 text-center text-gray-500">
              No customization types yet. Click “Add customization type” to create one.
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 flex h-auto min-h-10 w-full flex-wrap justify-start gap-1 overflow-x-auto bg-muted/50 p-1">
                {items.map((item) => (
                  <TabsTrigger
                    key={item._id}
                    value={item._id}
                    className="max-w-[200px] truncate px-3 py-2 text-sm"
                  >
                    {item.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {items.map((item) => (
                <TabsContent key={item._id} value={item._id} className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-sm bg-secondary-foreground px-3 py-1 text-xs font-medium text-accent">
                        {item.type}
                      </span>
                      {item.isRequired ? (
                        <span className="rounded-sm bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                          Required
                        </span>
                      ) : (
                        <span className="rounded-sm bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          Optional
                        </span>
                      )}
                      <div className="flex items-center gap-2 pl-2">
                        <span className="text-sm text-gray-600">Active</span>
                        <Switch
                          checked={item.status}
                          onCheckedChange={async () => {
                            try {
                              await updateCustomize({
                                id: item._id,
                                status: !item.status,
                              }).unwrap()
                            } catch {
                              toast({
                                title: 'Error',
                                description: 'Failed to update status. Please try again.',
                                variant: 'destructive',
                              })
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditType(item)}>
                        Edit type
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddOption(item)}
                        className="bg-secondary text-white"
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add option
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() =>
                          setDeleteTarget({ kind: 'category', item })
                        }
                      >
                        Delete type
                      </Button>
                    </div>
                  </div>

                  <OptionsTable
                    options={item.options ?? []}
                    categoryName={item.name}
                    onEdit={(opt) => handleEditOption(item, opt)}
                    onDelete={(opt) =>
                      setDeleteTarget({
                        kind: 'option',
                        categoryId: item._id,
                        categoryName: item.name,
                        option: opt,
                      })
                    }
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}

          {!showEmpty && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={data?.pagination?.total ?? items.length}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleLimitChange}
            />
          )}

          {(isLoading || isFetching) && (
            <div className="pt-4 text-sm text-gray-500">Loading customization types…</div>
          )}
        </CardContent>
      </Card>

      <AddEditCustomizationTypeModal
        open={typeModalOpen}
        onClose={() => {
          setTypeModalOpen(false)
          setEditingTypeId(null)
        }}
        editingId={editingTypeId}
        customization={selectedCategoryForTypeModal}
      />

      <AddEditCustomizationOptionModal
        open={optionModalOpen}
        onClose={() => {
          setOptionModalOpen(false)
          setOptionContextId(null)
          setEditingOption(null)
          setOptionCategoryName('')
        }}
        customizationId={optionContextId}
        categoryName={optionCategoryName}
        editingOption={editingOption}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete"
        description={deleteDescription}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </motion.div>
  )
}
