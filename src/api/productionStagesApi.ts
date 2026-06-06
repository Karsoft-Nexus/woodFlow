import { api } from './index';
import type { components } from './schema';

type ProductionStage = components['schemas']['ProductionStage'];
type ProductionStageCreate = components['schemas']['ProductionStage'];
type PatchedProductionStage = components['schemas']['PatchedProductionStage'];
type PaginatedProductionStageList = components['schemas']['PaginatedProductionStageList'];

export const productionStagesApi = {
  getStages: async (params?: { order?: number; worker?: number; status?: string; search?: string; limit?: number; page?: number; ordering?: string }) => {
    const response = await api.get<PaginatedProductionStageList>('/production-stages', { params });
    return response.data;
  },
  getStage: async (id: number) => {
    const response = await api.get<{ message: string; data: ProductionStage }>(`/production-stages/${id}`);
    return response.data.data;
  },
  createStage: async (data: ProductionStageCreate) => {
    const response = await api.post<{ message: string; data: ProductionStage }>('/production-stages', data);
    return response.data.data;
  },
  updateStage: async (id: number, data: ProductionStageCreate) => {
    const response = await api.put<{ message: string; data: ProductionStage }>(`/production-stages/${id}`, data);
    return response.data.data;
  },
  patchStage: async (id: number, data: PatchedProductionStage) => {
    const response = await api.patch<{ message: string; data: ProductionStage }>(`/production-stages/${id}`, data);
    return response.data.data;
  },
  deleteStage: async (id: number) => {
    await api.delete(`/production-stages/${id}`);
  }
};