import { api } from './index';

export const analyticsApi = {
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard-stats');
    return response.data;
  },
  getSalaryReport: async (params?: { start_date?: string; end_date?: string }) => {
    const response = await api.get('/analytics/salary-report', { params });
    return response.data;
  }
};