import axios from 'axios';
import type { FinancialTransaction, WorkerDailyStatus, Order, Worker, ProductionStage } from '../types';

// API client instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://alimplas.injiniring-kompaniya.uz/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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

export interface BackendCustomer {
  id: number;
  first_name: string;
  last_name?: string;
  phone: string;
  address?: string;
  created_at: string;
}

export interface BackendOrder {
  id: number;
  customer_detail: BackendCustomer;
  source: 'TELEGRAM' | 'INSTAGRAM' | 'PHONE' | 'OFFICE';
  product_type: 'KITCHEN' | 'SHKAF' | 'SPALNIY' | 'OFFICE' | 'OTHER';
  status: string;
  zamer_dimensions?: string | null;
  zamer_photos_url?: string | null;
  design_3d_url?: string | null;
  contract_number?: string | null;
  is_contract_signed: boolean;
  signed_at?: string | null;
  total_price: string;
  advance_payment: string;
  deadline?: string | null;
  customer: number;
  zamerchik?: number | null;
  designer?: number | null;
}

export const ordersApi = {
  getOrders: async () => {
    const response = await api.get<{ data: BackendOrder[] }>('/orders');
    return response.data.data;
  },
  createCustomer: async (customerData: { first_name: string; last_name?: string; phone: string; address?: string }) => {
    const response = await api.post<{ data: BackendCustomer }>('/customers', customerData);
    return response.data.data;
  },
  createOrder: async (orderData: {
    customer: number;
    source: 'TELEGRAM' | 'INSTAGRAM' | 'PHONE' | 'OFFICE';
    product_type: 'KITCHEN' | 'SHKAF' | 'SPALNIY' | 'OFFICE' | 'OTHER';
    total_price: string;
    advance_payment: string;
    deadline?: string;
  }) => {
    const response = await api.post<{ data: BackendOrder }>('/orders', orderData);
    return response.data.data;
  },
  assignZamer: async (orderId: string, zamerchikId: number, scheduledAt?: string) => {
    const response = await api.post(`/orders/${orderId}/assign-zamer`, {
      zamerchik: zamerchikId,
      zamer_scheduled_at: scheduledAt
    });
    return response.data;
  },
  uploadZamer: async (orderId: string, dimensions: any, photosUrl?: string) => {
    const response = await api.post(`/orders/${orderId}/upload-zamer`, {
      zamer_dimensions: typeof dimensions === 'string' ? dimensions : JSON.stringify(dimensions),
      zamer_photos_url: photosUrl
    });
    return response.data;
  },
  uploadDesign: async (orderId: string, designUrl: string) => {
    const response = await api.post(`/orders/${orderId}/upload-design`, {
      design_3d_url: designUrl
    });
    return response.data;
  },
  approveDesign: async (orderId: string) => {
    const response = await api.post(`/orders/${orderId}/approve-design`);
    return response.data;
  },
  signContract: async (orderId: string, data: { total_price: number; advance_payment: number; payment_method: string }) => {
    const response = await api.post(`/orders/${orderId}/sign-contract`, {
      total_price: String(data.total_price),
      advance_payment: String(data.advance_payment),
      payment_method: data.payment_method
    });
    return response.data;
  },
  updateOrder: async (orderId: string, patch: Partial<BackendOrder>) => {
    const response = await api.patch<{ data: BackendOrder }>(`/orders/${orderId}`, patch);
    return response.data.data;
  }
};

export interface LoginResponse {
  message: string;
  data: {
    id: number;
    phone: string;
    token: string | {
      access: string;
      refresh: string;
    };
  };
}

export const authApi = {
  login: async (phone: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', { phone, password });
    return response.data;
  }
};

