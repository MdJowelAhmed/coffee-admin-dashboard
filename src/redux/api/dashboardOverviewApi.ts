import { baseApi } from "../baseApi";

const dashboardOverviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
   getStatisticsInCardData: builder.query<GetStatisticsResponse, void>({
    query: () => ({
        url: `/analytics/summary-cards`,
        method: 'GET',
    }),
   }),
   getRevenueSummary: builder.query<GetRevenueSummaryResponse, void>({
    query: () => ({
        url: '/analytics/gross-revenue-by-month',
        method: 'GET',
    }),
   }),
   getOrderSummary: builder.query<GetOrderSummaryResponse, void>({
    query: () => ({
        url: '/analytics/orders-by-category',
        method: 'GET',
    }),
   }),
   getRecentActivity: builder.query<GetRecentActivityResponse, void>({
    query: () => ({
        url: '/analytics/recent-orders',
        method: 'GET',
    }),
   }),


    }),

})

export const {
    useGetStatisticsInCardDataQuery,
    useGetRevenueSummaryQuery,
    useGetOrderSummaryQuery,
    useGetRecentActivityQuery,
 } =
    dashboardOverviewApi