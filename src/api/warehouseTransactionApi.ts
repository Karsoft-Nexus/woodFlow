import { api } from './index';
import type { components } from './schema';

type WarehouseTransaction = components['schemas']['WarehouseTransaction'];
type PaginatedWarehouseTransactionList = components['schemas']['PaginatedWarehouseTransactionList'];
type PatchedWarehouseTransaction = components['schemas']['PatchedWarehouseTransaction'];

export const warehouseTransactionApi = {
  getTransactions: async (params?: { transaction_type?: string; material?: number; ordering?: string; page?: number; limit?: number }) => {
    const response = await api.get<PaginatedWarehouseTransactionList>('/transactions', { params });
    return response.data;
  },
  getTransaction: async (id: number) => {
    const response = await api.get<{ message: string; data: WarehouseTransaction }>(`/transactions/${id}`);
    return response.data.data;
  },
  createTransaction: async (data: WarehouseTransaction) => {
    const response = await api.post<{ message: string; data: WarehouseTransaction }>('/transactions', data);
    return response.data.data;
  },
  updateTransaction: async (id: number, data: WarehouseTransaction) => {
    const response = await api.put<{ message: string; data: WarehouseTransaction }>(`/transactions/${id}`, data);
    return response.data.data;
  },
  patchTransaction: async (id: number, data: PatchedWarehouseTransaction) => {
    const response = await api.patch<{ message: string; data: WarehouseTransaction }>(`/transactions/${id}`, data);
    return response.data.data;
  },
  deleteTransaction: async (id: number) => {
    await api.delete(`/transactions/${id}`);
  }
};