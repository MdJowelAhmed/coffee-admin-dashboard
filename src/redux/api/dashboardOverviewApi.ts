import { baseApi } from '../baseApi'
import type {
    DashboardRecentOrder,
    DashboardSummaryCards,
    GetOrderSummaryResponse,
    GetRecentActivityResponse,
    GetRevenueSummaryResponse,
    GetStatisticsResponse,
    OrderByCategoryItem,
    OrdersByCategoryRange,
    RevenueByMonthItem,
} from '../packageTypes/dashboardOverview'

const dashboardOverviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStatisticsInCardData: builder.query<DashboardSummaryCards, void>({
            query: () => ({
                url: `/analytics/summary-cards`,
                method: 'GET',
            }),
            transformResponse: (response: GetStatisticsResponse) => response.data,
        }),
        getRevenueSummary: builder.query<RevenueByMonthItem[], { year: number }>({
            query: ({ year }) => ({
                url: '/analytics/gross-revenue-by-month',
                method: 'GET',
                params: { year },
            }),
            transformResponse: (response: GetRevenueSummaryResponse) => response.data,
        }),
        getOrderSummary: builder.query<OrderByCategoryItem[], { range: OrdersByCategoryRange }>({
            query: ({ range }) => ({
                url: '/analytics/orders-by-category',
                method: 'GET',
                params: { range },
            }),
            transformResponse: (response: GetOrderSummaryResponse) => response.data,
        }),
        getRecentActivity: builder.query<DashboardRecentOrder[], void>({
            query: () => ({
                url: '/analytics/recent-orders',
                method: 'GET',
            }),
            transformResponse: (response: GetRecentActivityResponse) => response.data,
        }),
    }),
})

export const {
    useGetStatisticsInCardDataQuery,
    useGetRevenueSummaryQuery,
    useGetOrderSummaryQuery,
    useGetRecentActivityQuery,
} = dashboardOverviewApi
