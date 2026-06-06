import { $authHost } from '@/api'
import { useQuery } from '@tanstack/react-query'

export const analyticsService = {
	async getDashboardStats(): Promise<unknown> {
		const { data } = await $authHost.get('/analytics/dashboard-stats')
		return data
	},
	async getSalaryReport(params?: { start_date?: string; end_date?: string }): Promise<unknown> {
		const { data } = await $authHost.get('/analytics/salary-report', { params })
		return data
	},
}

export const useGetDashboardStats = () => {
	return useQuery({
		queryKey: ['dashboard-stats'],
		queryFn: () => analyticsService.getDashboardStats(),
	})
}

export const useGetSalaryReport = (params?: { start_date?: string; end_date?: string }) => {
	return useQuery({
		queryKey: ['salary-report', params],
		queryFn: () => analyticsService.getSalaryReport(params),
	})
}
