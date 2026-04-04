import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserActionButtons } from './UserActionButtons'
import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/formatters'
import type { User } from '@/types'

interface UserTableProps {
  users: User[]
  onView: (user: User) => void
  onLock: (user: User) => void
}

export function UserTable({ users, onView, onLock }: UserTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-success text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-bold">User Name</th>
            
            <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Phone</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Address</th>
            <th className="px-6 py-4 text-left text-sm font-bold">status</th>
            <th className="px-6 py-4 text-right text-sm font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No users found. Try adjusting your filters.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* User Name Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          user.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                        }
                      />
                      <AvatarFallback className="bg-slate-200 text-slate-700 text-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-slate-800">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </td>
 {/* Email Column */}
 <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{user.email}</span>
                </td>
                {/* Phone Column */}
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{user.phone}</span>
                </td>

               {/* Address Column */}
               <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{user.address}</span>
                </td>

                {/* Status Column */}
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-3 w-20 text-center rounded-sm text-xs font-medium text-white',
                      user.status === 'active' && 'bg-green-500',
                      user.status === 'inactive' && 'bg-amber-700',
                      user.status === 'blocked' && 'bg-red-600',
                      user.status === 'pending' && 'bg-amber-600'
                    )}
                  >
                    {user.status === 'active'
                      ? 'Active'
                      : user.status === 'inactive'
                      ? 'Inactive'
                      : user.status === 'blocked'
                      ? 'Blocked'
                      : 'Pending'}
                  </span>
                </td>

                {/* Actions Column — details only via Eye button */}
                <td className="px-6 py-4">
                  <UserActionButtons
                    user={user}
                    onView={onView}
                    onLock={onLock}
                  />
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
