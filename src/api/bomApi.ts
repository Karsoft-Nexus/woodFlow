import { api } from './index';
import type { components } from './schema';

type BOM = components['schemas']['BOM'];
type BOMCreate = components['schemas']['BOM'];
type PatchedBOM = components['schemas']['PatchedBOM'];
type PaginatedBOMList = components['schemas']['PaginatedBOMList'];

export const bomApi = {
  getBOMs: async (params?: { order?: number; material?: number; search?: string; limit?: number; page?: number; ordering?: string }) => {
    const response = await api.get<PaginatedBOMList>('/bom', { params });
    return response.data;
  },
  getBOM: async (id: number) => {
    const response = await api.get<{ message: string; data: BOM }>(`/bom/${id}`);
    return response.data.data;
  },
  createBOM: async (data: BOMCreate) => {
    const response = await api.post<{ message: string; data: BOM }>('/bom', data);
    return response.data.data;
  },
  updateBOM: async (id: number, data: BOMCreate) => {
    const response = await api.put<{ message: string; data: BOM }>(`/bom/${id}`, data);
    return response.data.data;
  },
  patchBOM: async (id: number, data: PatchedBOM) => {
    const response = await api.patch<{ message: string; data: BOM }>(`/bom/${id}`, data);
    return response.data.data;
  },
  deleteBOM: async (id: number) => {
    await api.delete(`/bom/${id}`);
  }
};