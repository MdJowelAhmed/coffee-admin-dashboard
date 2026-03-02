import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { recentOrdersData } from './dashboardData'

export function RecentActivityCard() {
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
                    <button className="rounded-md bg-[#1E63D8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1654BA]">
                        View All
                    </button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="w-full overflow-auto">
                        <table className="w-full min-w-[980px]">
                            <thead>
                                <tr className="bg-[#E2FBFB] text-slate-800">
                                    <th className="px-6 py-4 text-left text-sm font-bold">SL</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold">Items</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold">Date &amp; Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold">Item Number</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold">status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-accent-foreground">
                                {recentOrdersData.map((order, index) => (
                                    <motion.tr
                                        key={`${order.sl}-${order.orderId}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="hover:bg-gray-50/50"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                            {order.sl}
                                        </td>
                                        <td className="px-6 py-4">
                                            <img
                                                src={order.itemImage}
                                                alt={order.title}
                                                className="h-14 w-16 rounded-md object-cover"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-semibold text-slate-800">{order.title}</span>
                                                <span className="text-sm font-medium text-slate-600">{order.orderId}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-slate-700">{order.date}</span>
                                                <span className="w-fit rounded-sm bg-gray-100 px-3 py-1 text-xs text-slate-700">
                                                    {order.time}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                                            {order.customer}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                                            {order.itemCount}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                                            {order.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex min-w-[120px] items-center justify-center gap-1 rounded-sm px-3 py-2 text-xs font-semibold text-white ${order.status === 'Completed'
                                                        ? 'bg-[#2FB65D]'
                                                        : order.status === 'Processing'
                                                            ? 'bg-[#2F8DF5]'
                                                            : 'bg-[#FF3A3A]'
                                                    }`}
                                            >
                                                {order.status === 'Completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                {order.status === 'Processing' && <Clock3 className="h-3.5 w-3.5" />}
                                                {order.status === 'Cancelled' && <XCircle className="h-3.5 w-3.5" />}
                                                {order.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
