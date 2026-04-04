import { motion } from 'framer-motion'
import { formatDate } from '@/utils/formatters'
import { sliceMessageByWords } from '@/utils/textUtils'
import { cn } from '@/utils/cn'
import type { NotificationApiType, PushNotification } from '@/types'

interface NotificationTableProps {
  notifications: PushNotification[]
}

const typeBadgeClasses: Record<NotificationApiType, string> = {
  ORDER: 'bg-blue-100 text-blue-800 border-blue-200',
  PAYMENT: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PROMOTION: 'bg-amber-100 text-amber-800 border-amber-200',
  SYSTEM: 'bg-slate-100 text-slate-800 border-slate-200',
  DAILY_SPECIAL: 'bg-violet-100 text-violet-800 border-violet-200',
  NEW_DRINK: 'bg-rose-100 text-rose-800 border-rose-200',
}

const statusBadge = (status: PushNotification['status']) =>
  status === 'Read'
    ? 'bg-slate-100 text-slate-700'
    : 'bg-sky-100 text-sky-800'

export function NotificationTable({ notifications }: NotificationTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">Title</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Message</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Receiver</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Type</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-muted-foreground"
              >
                No notifications found. Try adjusting your filters.
              </td>
            </tr>
          ) : (
            notifications.map((notif, index) => (
              <motion.tr
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-800">
                    {notif.title}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <span className="text-sm text-slate-700 line-clamp-2">
                    {sliceMessageByWords(notif.message)}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-[200px]">
                  <span className="text-sm text-slate-700 line-clamp-2">
                    {notif.receiverName || '—'}
                    {notif.receiverEmail ? (
                      <span className="block text-xs text-muted-foreground truncate">
                        {notif.receiverEmail}
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border',
                      typeBadgeClasses[notif.type] ??
                        'bg-gray-100 text-gray-800 border-gray-200'
                    )}
                  >
                    {notif.type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {formatDate(notif.date, 'dd-MM-yyyy')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      statusBadge(notif.status)
                    )}
                  >
                    {notif.status}
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
