import axios from 'axios';
import type { FinancialTransaction, WorkerDailyStatus, Order, Worker, ProductionStage, Material, MaterialCategory, Offcut, BOM, PaginatedResponse } from '../types';

// API client instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Types for responses if needed
export interface BoardDataResponse {
  orders: Order[];
  workers: Worker[];
  productionStages: ProductionStage[];
}

export interface PayoutResponse {
  id: string;
  workerId: string;
  stageId: string;
  amount: number;
  stageName: string;
  orderNumber: string;
  createdAt: string;
}

// API functions
export const productionApi = {
  getBoardData: async () => {
    const response = await api.get<BoardDataResponse>('/production/board/');
    return response.data;
  },
  setDailyStatus: async (workerId: string, dailyStatus: WorkerDailyStatus) => {
    const response = await api.post(`/workers/${workerId}/set-daily-status/`, { daily_status: dailyStatus });
    return response.data;
  },
  startStage: async (stageId: string, workerId: string) => {
    const response = await api.post(`/production/stages/${stageId}/start/`, { worker_id: workerId });
    return response.data;
  },
  finishStage: async (stageId: string) => {
    const response = await api.post(`/production/stages/${stageId}/finish/`);
    return response.data;
  },
  getWorkerPayouts: async (workerId: string) => {
    const response = await api.get<PayoutResponse[]>(`/workers/${workerId}/payouts/`);
    return response.data;
  },
};

export const financeApi = {
  getTransactions: async () => {
    const response = await api.get<FinancialTransaction[]>('/finance/transactions/');
    return response.data;
  },
  addTransaction: async (tx: Omit<FinancialTransaction, 'id' | 'createdAt'>) => {
    const response = await api.post<FinancialTransaction>('/finance/transactions/', tx);
    return response.data;
  },
};

export const warehouseApi = {
  getCategories: async () => {
    const response = await api.get<PaginatedResponse<MaterialCategory>>('/categories/');
    return response.data;
  },
  getMaterials: async (params?: { low_stock?: boolean; category?: number }) => {
    const response = await api.get<PaginatedResponse<Material>>('/materials/', { params });
    return response.data;
  },
  createMaterial: async (data: Omit<Material, 'id'>) => {
    const response = await api.post<{ message: string; data: Material }>('/materials/', data);
    return response.data;
  },
  getOffcuts: async () => {
    const response = await api.get<PaginatedResponse<Offcut>>('/offcuts/');
    return response.data;
  },
  createOffcut: async (data: Omit<Offcut, 'id'>) => {
    const response = await api.post<{ message: string; data: Offcut }>('/offcuts/', data);
    return response.data;
  },
};

export const bomApi = {
  getBOMs: async (orderId?: number) => {
    const response = await api.get<PaginatedResponse<BOM>>('/bom/', { params: { order: orderId } });
    return response.data;
  },
  createBOM: async (data: Omit<BOM, 'id'>) => {
    const response = await api.post<{ message: string; data: BOM }>('/bom/', data);
    return response.data;
  },
};
