import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { capitalize, formatCurrency } from '@/utils/formatters'
import { format } from 'date-fns'
import type { DashboardRecentOrder } from '@/redux/packageTypes/dashboardOverview'

function displayStatus(orderStatus: string): string {
    return orderStatus
        .split(/[_\s]+/)
        .map((w) => capitalize(w))
        .join(' ')
}

function statusStyle(status: string): { className: string; icon: typeof CheckCircle2 | null } {
    const s = status.toLowerCase()
    if (s === 'completed' || s === 'delivered') {
        return { className: 'bg-[#2FB65D]', icon: CheckCircle2 }
    }
    if (s === 'cancelled' || s === 'canceled' || s === 'refunded') {
        return { className: 'bg-[#FF3A3A]', icon: XCircle }
    }
    return { className: 'bg-[#2F8DF5]', icon: Clock3 }
}

function firstLineTitle(order: DashboardRecentOrder): string {
    const first = order.items[0]?.productName
    if (!first) return 'Order'
    if (order.items.length <= 1) return first
    return `${first} +${order.items.length - 1}`
}

function itemThumb(order: DashboardRecentOrder): { src?: string; label: string } {
    const img = order.customer?.profileImage?.trim()
    const label = firstLineTitle(order).charAt(0).toUpperCase()
    if (img) return { src: img, label }
    return { label }
}

interface RecentActivityCardProps {
    orders: DashboardRecentOrder[]
    isLoading?: boolean
}

export function RecentActivityCard({ orders, isLoading }: RecentActivityCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="col-span-1 border-none shadow-sm"
        >
            <Card className="bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                    <CardTitle className="text-xl font-bold text-slate-800">Recent Order</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">Loading orders…</div>
                    ) : orders.length === 0 ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">No recent orders.</div>
                    ) : (
                        <div className="w-full overflow-auto">
                            <table className="w-full min-w-[980px]">
                                <thead>
                                    <tr className="bg-success text-slate-800">
                                        <th className="px-6 py-4 text-left text-sm font-bold">SL</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Items Names</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Date &amp; Time</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Item Number</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-accent-foreground">
                                    {orders.map((order, index) => {
                                        const sl = String(index + 1).padStart(2, '0')
                                        const thumb = itemThumb(order)
                                        const created = new Date(order.createdAt)
                                        const dateStr = format(created, 'dd MMM yyyy')
                                        const timeStr = format(created, 'h:mm a')
                                        const itemCount = order.items?.length ?? 0
                                        const { className: statusClass, icon: StatusIcon } = statusStyle(
                                            order.orderStatus
                                        )
                                        const statusLabel = displayStatus(order.orderStatus)

                                        return (
                                            <motion.tr
                                                key={order._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * index }}
                                                className="hover:bg-gray-50/50"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-slate-700">{sl}</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-700">
                                                        {order.orderId}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-700">
                                                        {firstLineTitle(order)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-medium text-slate-700">
                                                            {dateStr}
                                                        </span>
                                                        <span className="w-fit rounded-sm bg-gray-100 px-3 py-1 text-xs text-slate-700">
                                                            {timeStr}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                                                    {order.customer?.name?.trim() ||
                                                        order.customer?.email ||
                                                        '—'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                                                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                                                    {formatCurrency(order.totalAmount)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex min-w-[120px] items-center justify-center gap-1 rounded-sm px-3 py-3 text-xs font-semibold text-white ${statusClass}`}
                                                    >
                                                        {StatusIcon ? <StatusIcon className="h-3.5 w-3.5" /> : null}
                                                        {statusLabel}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
