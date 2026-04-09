import { motion } from 'framer-motion'
import type { Controller } from '@/types'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

interface ControllerTableProps {
  controllers: Controller[]
  onToggleStatus: (c: Controller, nextActive: boolean) => void
  onDelete: (c: Controller) => void
  isTogglingId?: string | null
  isDeletingId?: string | null
}

export function ControllerTable({
  controllers,
  onToggleStatus,
  onDelete,
  isTogglingId,
  isDeletingId,
}: ControllerTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Phone</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Shop</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {controllers.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No controllers yet. Add one to get started.
              </td>
            </tr>
          ) : (
            controllers.map((controller, index) => (
              <motion.tr
                key={controller.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-800">
                    {controller.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {controller.email}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {controller.phone}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-medium capitalize bg-primary/10 text-primary">
                    {controller.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {controller.shopName ?? '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={(controller.status ?? '').toLowerCase() === 'active'}
                      disabled={isTogglingId === controller.id}
                      onCheckedChange={(checked) => onToggleStatus(controller, checked)}
                      aria-label={
                        (controller.status ?? '').toLowerCase() === 'active'
                          ? 'Set controller inactive'
                          : 'Set controller active'
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:border-red-200"
                      disabled={isDeletingId === controller.id}
                      onClick={() => onDelete(controller)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
