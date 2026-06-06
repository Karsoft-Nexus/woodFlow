import { api } from './index';
import type { components } from './schema';

type Category = components['schemas']['MaterialCategory'];
type CategoryCreate = components['schemas']['MaterialCategory'];
type PatchedCategory = components['schemas']['PatchedMaterialCategory'];
type PaginatedCategoryList = components['schemas']['PaginatedMaterialCategoryList'];

type Material = components['schemas']['Material'];
type MaterialCreate = components['schemas']['Material'];
type PatchedMaterial = components['schemas']['PatchedMaterial'];
type PaginatedMaterialList = components['schemas']['PaginatedMaterialList'];

type Offcut = components['schemas']['Offcut'];
type OffcutCreate = components['schemas']['Offcut'];
type PatchedOffcut = components['schemas']['PatchedOffcut'];
type PaginatedOffcutList = components['schemas']['PaginatedOffcutList'];

type Unit = components['schemas']['MeasurementUnit'];
type UnitCreate = components['schemas']['MeasurementUnit'];
type PatchedUnit = components['schemas']['PatchedMeasurementUnit'];
type PaginatedUnitList = components['schemas']['PaginatedMeasurementUnitList'];

type Reservation = components['schemas']['MaterialReservation'];
type ReservationCreate = components['schemas']['MaterialReservation'];
type PatchedReservation = components['schemas']['PatchedMaterialReservation'];
type PaginatedReservationList = components['schemas']['PaginatedMaterialReservationList'];

export const inventoryApi = {
  // Categories
  getCategories: async (params?: { search?: string; limit?: number; page?: number; ordering?: string }) => {
    const response = await api.get<PaginatedCategoryList>('/categories', { params });
    return response.data;
  },
  getCategory: async (id: number) => {
    const response = await api.get<{ message: string; data: Category }>(`/categories/${id}`);
    return response.data.data;
  },
  createCategory: async (data: CategoryCreate) => {
    const response = await api.post<{ message: string; data: Category }>('/categories', data);
    return response.data.data;
  },
  updateCategory: async (id: number, data: CategoryCreate) => {
    const response = await api.put<{ message: string; data: Category }>(`/categories/${id}`, data);
    return response.data.data;
  },
  patchCategory: async (id: number, data: PatchedCategory) => {
    const response = await api.patch<{ message: string; data: Category }>(`/categories/${id}`, data);
    return response.data.data;
  },
  deleteCategory: async (id: number) => {
    await api.delete(`/categories/${id}`);
  },

  // Materials
  getMaterials: async (params?: { category?: number; search?: string; limit?: number; page?: number; ordering?: string }) => {
    const response = await api.get<PaginatedMaterialList>('/materials', { params });
    return response.data;
  },
  getMaterial: async (id: number) => {
    const response = await api.get<{ message: string; data: Material }>(`/materials/${id}`);
    return response.data.data;
  },
  createMaterial: async (data: MaterialCreate) => {
    const response = await api.post<{ message: string; data: Material }>('/materials', data);
    return response.data.data;
  },
  updateMaterial: async (id: number, data: MaterialCreate) => {
    const response = await api.put<{ message: string; data: Material }>(`/materials/${id}`, data);
    return response.data.data;
  },
  patchMaterial: async (id: number, data: PatchedMaterial) => {
    const response = await api.patch<{ message: string; data: Material }>(`/materials/${id}`, data);
    return response.data.data;
  },
  deleteMaterial: async (id: number) => {
    await api.delete(`/materials/${id}`);
  },

  // Offcuts
  getOffcuts: async (params?: { material?: number; is_used?: boolean; search?: string; limit?: number; page?: number; ordering?: string }) => {
    const response = await api.get<PaginatedOffcutList>('/offcuts', { params });
    return response.data;
  },
  getOffcut: async (id: number) => {
    const response = await api.get<{ message: string; data: Offcut }>(`/offcuts/${id}`);
    return response.data.data;
  },
  createOffcut: async (data: OffcutCreate) => {
    const response = await api.post<{ message: string; data: Offcut }>('/offcuts', data);
    return response.data.data;
  },
  updateOffcut: async (id: number, data: OffcutCreate) => {
    const response = await api.put<{ message: string; data: Offcut }>(`/offcuts/${id}`, data);
    return response.data.data;
  },
  patchOffcut: async (id: number, data: PatchedOffcut) => {
    const response = await api.patch<{ message: string; data: Offcut }>(`/offcuts/${id}`, data);
    return response.data.data;
  },
  deleteOffcut: async (id: number) => {
    await api.delete(`/offcuts/${id}`);
  },

  // Units
  getUnits: async (params?: { search?: string; limit?: number; page?: number; ordering?: string }) => {
    const response = await api.get<PaginatedUnitList>('/units', { params });
    return response.data;
  },
  getUnit: async (id: number) => {
    const response = await api.get<{ message: string; data: Unit }>(`/units/${id}`);
    return response.data.data;
  },
  createUnit: async (data: UnitCreate) => {
    const response = await api.post<{ message: string; data: Unit }>('/units', data);
    return response.data.data;
  },
  updateUnit: async (id: number, data: UnitCreate) => {
    const response = await api.put<{ message: string; data: Unit }>(`/units/${id}`, data);
    return response.data.data;
  },
  patchUnit: async (id: number, data: PatchedUnit) => {
    const response = await api.patch<{ message: string; data: Unit }>(`/units/${id}`, data);
    return response.data.data;
  },
  deleteUnit: async (id: number) => {
    await api.delete(`/units/${id}`);
  },

  // Reservations
  getReservations: async (params?: { material?: number; search?: string; limit?: number; page?: number; ordering?: string }) => {
    const response = await api.get<PaginatedReservationList>('/reservations', { params });
    return response.data;
  },
  getReservation: async (id: number) => {
    const response = await api.get<{ message: string; data: Reservation }>(`/reservations/${id}`);
    return response.data.data;
  },
  createReservation: async (data: ReservationCreate) => {
    const response = await api.post<{ message: string; data: Reservation }>('/reservations', data);
    return response.data.data;
  },
  updateReservation: async (id: number, data: ReservationCreate) => {
    const response = await api.put<{ message: string; data: Reservation }>(`/reservations/${id}`, data);
    return response.data.data;
  },
  patchReservation: async (id: number, data: PatchedReservation) => {
    const response = await api.patch<{ message: string; data: Reservation }>(`/reservations/${id}`, data);
    return response.data.data;
  },
  deleteReservation: async (id: number) => {
    await api.delete(`/reservations/${id}`);
  },
  consumeReservation: async (data: { reservation_id: number; consumed_quantity: number }) => {
    const response = await api.post('/reservations/consume-reservation', data);
    return response.data;
  },
  createCustomReservation: async (data: { material_id: number; reserved_quantity: number; expected_date?: string }) => {
    const response = await api.post('/reservations/create-reservation', data);
    return response.data;
  }
};
