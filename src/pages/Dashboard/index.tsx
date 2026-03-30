import { useMemo, useState } from 'react'
import { formatCurrency, formatCompactNumber } from '@/utils/formatters'
import { StatCard } from './StatCard'
import { EarningsSummaryChart } from './EarningsSummaryChart'
import { RecentActivityCard } from './RecentActivityCard'
import { BarChart2Icon, DollarSign, ListOrdered, UserPlus } from 'lucide-react'
import { PieChartComponent } from './PieChart'
import {
    useGetOrderSummaryQuery,
    useGetRecentActivityQuery,
    useGetRevenueSummaryQuery,
    useGetStatisticsInCardDataQuery,
} from '@/redux/api/dashboardOverviewApi'
import type { OrdersByCategoryRange } from '@/redux/packageTypes/dashboardOverview'

function buildYearOptions(backYears = 5): string[] {
    const y = new Date().getFullYear()
    return Array.from({ length: backYears + 1 }, (_, i) => String(y - i))
}

export default function Dashboard() {
    const yearOptions = useMemo(() => buildYearOptions(5), [])
    const [selectedYear, setSelectedYear] = useState(() => String(new Date().getFullYear()))
    const [categoryRange, setCategoryRange] = useState<OrdersByCategoryRange>('week')

    const yearNum = Number.parseInt(selectedYear, 10)

    const { data: summary, isLoading: summaryLoading } = useGetStatisticsInCardDataQuery()
    const { data: revenueRows = [], isLoading: revenueLoading } = useGetRevenueSummaryQuery(
        { year: yearNum },
        { skip: Number.isNaN(yearNum) }
    )
    const { data: categoryItems = [], isLoading: categoryLoading } = useGetOrderSummaryQuery({
        range: categoryRange,
    })
    const { data: recentOrders = [], isLoading: recentLoading } = useGetRecentActivityQuery()

    const stats = useMemo(
        () => [
            {
                title: 'Total Orders',
                value: summaryLoading ? '—' : formatCompactNumber(summary?.totalOrders ?? 0),
                icon: ListOrdered,
                description: undefined,
                change: undefined,
                index: 0,
            },
            {
                title: 'Total Sales',
                value: summaryLoading ? '—' : formatCompactNumber(summary?.totalSales ?? 0),
                icon: DollarSign,
                description: undefined,
                change: undefined,
                index: 1,
            },
            {
                title: 'New Customers',
                value: summaryLoading ? '—' : formatCompactNumber(summary?.newCustomersLast30Days ?? 0),
                icon: UserPlus,
                description: undefined,
                change: undefined,
                index: 2,
            },
            {
                title: 'Total Revenue',
                value: summaryLoading ? '—' : formatCurrency(summary?.totalGrossRevenue ?? 0),
                icon: BarChart2Icon,
                description: undefined,
                change: undefined,
                index: 3,
            },
        ],
        [summary, summaryLoading]
    )

    const chartData = useMemo(
        () => revenueRows.map((r) => ({ month: r.month, revenue: r.revenue, year: r.year })),
        [revenueRows]
    )

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="col-span-8">
                    <EarningsSummaryChart
                        chartData={chartData}
                        selectedYear={selectedYear}
                        yearOptions={yearOptions}
                        onYearChange={setSelectedYear}
                        isLoading={revenueLoading}
                    />
                </div>
                <div className="col-span-4">
                    <PieChartComponent
                        categoryItems={categoryItems}
                        selectedRange={categoryRange}
                        onRangeChange={setCategoryRange}
                        isLoading={categoryLoading}
                    />
                </div>
            </div>

            <div>
                <RecentActivityCard orders={recentOrders} isLoading={recentLoading} />
            </div>
        </div>
    )
}
