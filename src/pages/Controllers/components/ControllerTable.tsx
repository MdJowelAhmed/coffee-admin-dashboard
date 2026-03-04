import { motion } from 'framer-motion'
import type { Controller } from '@/types'

interface ControllerTableProps {
  controllers: Controller[]
}

export function ControllerTable({ controllers }: ControllerTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-[#E2FBFB] text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Phone</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Shop</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {controllers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
