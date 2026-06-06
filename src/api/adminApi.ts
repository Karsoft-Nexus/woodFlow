import { api } from './index';
import type { components } from './schema';

type AdminGetMe = components['schemas']['AdminGetMe'];
type PatchedAdminGetMe = components['schemas']['PatchedAdminGetMe'];
type Role = components['schemas']['Role'];
type RoleCreate = components['schemas']['Role'];
type PatchedRole = components['schemas']['PatchedRole'];
type PaginatedRoleList = components['schemas']['PaginatedRoleList'];

type UserSalary = components['schemas']['UserSalary'];
type PatchedUserSalary = components['schemas']['PatchedUserSalary'];
type PaginatedUserSalaryList = components['schemas']['PaginatedUserSalaryList'];

type AdminGet = components['schemas']['AdminCreate'];
type AdminCreate = components['schemas']['AdminCreate'];
type PaginatedAdminGetList = components['schemas']['PaginatedAdminCreateList'];
type PatchedAdminCreate = components['schemas']['PatchedAdminCreate'];

export const adminApi = {
  // Profile
  getProfile: async () => {
    const response = await api.get<AdminGetMe>('/admins/profile');
    return response.data;
  },
  updateProfile: async (data: AdminGetMe) => {
    const response = await api.put<{ message: string; data: AdminGetMe }>('/admins/profile', data);
    return response.data.data;
  },
  patchProfile: async (data: PatchedAdminGetMe) => {
    const response = await api.patch<{ message: string; data: AdminGetMe }>('/admins/profile', data);
    return response.data.data;
  },

  // Roles
  getRoles: async (params?: { code?: string; name?: string; search?: string; limit?: number; page?: number; ordering?: string }) => {
    const response = await api.get<PaginatedRoleList>('/admins/roles', { params });
    return response.data;
  },
  getRole: async (id: number) => {
    const response = await api.get<{ message: string; data: Role }>(`/admins/roles/${id}`);
    return response.data.data;
  },
  createRole: async (data: RoleCreate) => {
    const response = await api.post<{ message: string; data: Role }>('/admins/roles', data);
    return response.data.data;
  },
  updateRole: async (id: number, data: RoleCreate) => {
    const response = await api.put<{ message: string; data: Role }>(`/admins/roles/${id}`, data);
    return response.data.data;
  },
  patchRole: async (id: number, data: PatchedRole) => {
    const response = await api.patch<{ message: string; data: Role }>(`/admins/roles/${id}`, data);
    return response.data.data;
  },
  deleteRole: async (id: number) => {
    await api.delete(`/admins/roles/${id}`);
  },

  // Users (Admins)
  getUsers: async (params?: { search?: string; limit?: number; page?: number; ordering?: string }) => {
    const response = await api.get<PaginatedAdminGetList>('/admins/users', { params });
    return response.data;
  },
  getUser: async (id: number) => {
    const response = await api.get<{ message: string; data: AdminGet }>(`/admins/users/${id}`);
    return response.data.data;
  },
  createUser: async (data: AdminCreate) => {
    const response = await api.post<{ message: string; data: AdminCreate }>('/admins/users', data);
    return response.data.data;
  },
  updateUser: async (id: number, data: AdminCreate) => {
    const response = await api.put<{ message: string; data: AdminCreate }>(`/admins/users/${id}`, data);
    return response.data.data;
  },
  patchUser: async (id: number, data: PatchedAdminCreate) => {
    const response = await api.patch<{ message: string; data: AdminCreate }>(`/admins/users/${id}`, data);
    return response.data.data;
  },
  deleteUser: async (id: number) => {
    await api.delete(`/admins/users/${id}`);
  },

  // User Salaries
  getUserSalaries: async (params?: { user?: number; month?: string; search?: string; limit?: number; page?: number; ordering?: string }) => {
    const response = await api.get<PaginatedUserSalaryList>('/admins/user-salaries', { params });
    return response.data;
  },
  getUserSalary: async (id: number) => {
    const response = await api.get<{ message: string; data: UserSalary }>(`/admins/user-salaries/${id}`);
    return response.data.data;
  },
  createUserSalary: async (data: UserSalary) => {
    const response = await api.post<{ message: string; data: UserSalary }>('/admins/user-salaries', data);
    return response.data.data;
  },
  updateUserSalary: async (id: number, data: UserSalary) => {
    const response = await api.put<{ message: string; data: UserSalary }>(`/admins/user-salaries/${id}`, data);
    return response.data.data;
  },
  patchUserSalary: async (id: number, data: PatchedUserSalary) => {
    const response = await api.patch<{ message: string; data: UserSalary }>(`/admins/user-salaries/${id}`, data);
    return response.data.data;
  },
  deleteUserSalary: async (id: number) => {
    await api.delete(`/admins/user-salaries/${id}`);
  }
};
