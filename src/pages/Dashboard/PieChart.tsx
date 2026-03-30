import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import type { OrderByCategoryItem, OrdersByCategoryRange } from '@/redux/packageTypes/dashboardOverview'

const SLICE_COLORS = ['#06B6D4', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6']

function normalizeSlices(items: OrderByCategoryItem[]): { name: string; value: number }[] {
    return items
        .map((item) => {
            const name =
                item.categoryName ?? item.category ?? item.name ?? (item._id ? `Category ${item._id.slice(-4)}` : 'Other')
            const value =
                item.orders ?? item.count ?? item.value ?? item.totalOrders ?? 0
            return { name, value: Math.max(0, value) }
        })
        .filter((s) => s.value > 0)
}

interface PieChartComponentProps {
    categoryItems: OrderByCategoryItem[]
    selectedRange: OrdersByCategoryRange
    onRangeChange: (range: OrdersByCategoryRange) => void
    isLoading?: boolean
}

export function PieChartComponent({
    categoryItems,
    selectedRange,
    onRangeChange,
    isLoading,
}: PieChartComponentProps) {
    const rawSlices = normalizeSlices(categoryItems)
    const total = rawSlices.reduce((sum, s) => sum + s.value, 0)
    const pieData = total > 0 ? rawSlices : []

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className=""
        >
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Orders By Category</CardTitle>
                        <Select
                            value={selectedRange}
                            onValueChange={(v) => onRangeChange(v as OrdersByCategoryRange)}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-[130px] bg-secondary-foreground text-accent border-none">
                                <SelectValue placeholder="Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-[270px] w-full flex items-center justify-center text-sm text-muted-foreground">
                            Loading…
                        </div>
                    ) : pieData.length === 0 ? (
                        <div className="h-[270px] w-full flex flex-col items-center justify-center gap-2 text-center px-4">
                            <p className="text-sm font-medium text-slate-700">No category data</p>
                            <p className="text-xs text-muted-foreground max-w-xs">
                                Orders by category will appear here for the selected period.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="h-[270px] w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({
                                                cx,
                                                cy,
                                                midAngle,
                                                outerRadius,
                                                percent,
                                                index,
                                            }) => {
                                                const RADIAN = Math.PI / 180

                                                if (midAngle === undefined) {
                                                    return null
                                                }

                                                const x1 = cx + outerRadius * Math.cos(-midAngle * RADIAN)
                                                const y1 = cy + outerRadius * Math.sin(-midAngle * RADIAN)
                                                const x2 = cx + (outerRadius + 20) * Math.cos(-midAngle * RADIAN)
                                                const y2 = cy + (outerRadius + 20) * Math.sin(-midAngle * RADIAN)
                                                const goLeft = index === 1
                                                const horizontalDistance = 35
                                                const x3 = x2 + (goLeft ? -horizontalDistance : horizontalDistance)
                                                const y3 = y2
                                                const labelX = x3 + (goLeft ? -25 : 25)
                                                const labelY = y3

                                                return (
                                                    <g>
                                                        <line
                                                            x1={x1}
                                                            y1={y1}
                                                            x2={x2}
                                                            y2={y2}
                                                            stroke="#E5E7EB"
                                                            strokeWidth={2}
                                                        />
                                                        <line
                                                            x1={x2}
                                                            y1={y2}
                                                            x2={x3}
                                                            y2={y3}
                                                            stroke="#E5E7EB"
                                                            strokeWidth={2}
                                                        />
                                                        <rect
                                                            x={labelX - 28}
                                                            y={labelY - 12}
                                                            width={56}
                                                            height={24}
                                                            fill="white"
                                                            rx={4}
                                                        />
                                                        <text
                                                            x={labelX}
                                                            y={labelY}
                                                            fill="#1F2937"
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                            className="text-sm font-semibold border-none"
                                                        >
                                                            {percent != null ? Math.round(percent * 100) : 0}%
                                                        </text>
                                                    </g>
                                                )
                                            }}
                                        >
                                            {pieData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const row = payload[0].payload as {
                                                        name: string
                                                        value: number
                                                    }
                                                    const pct =
                                                        total > 0 ? Math.round((row.value / total) * 100) : 0
                                                    return (
                                                        <div className="bg-white border rounded-lg shadow-lg px-3 py-2">
                                                            <p className="font-semibold text-sm">
                                                                {row.name}: {row.value} orders ({pct}%)
                                                            </p>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                                {pieData.map((slice, index) => (
                                    <div key={slice.name} className="flex items-center gap-2">
                                        <div
                                            className="w-10 h-3 rounded-sm"
                                            style={{
                                                backgroundColor: SLICE_COLORS[index % SLICE_COLORS.length],
                                            }}
                                        />
                                        <span className="text-sm text-muted-foreground">{slice.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
