import axios from 'axios';
import type { FinancialTransaction, WorkerDailyStatus, Order, Worker, ProductionStage } from '../types';

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
