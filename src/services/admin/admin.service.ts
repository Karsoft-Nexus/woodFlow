import { $authHost } from '@/api'
import type { IResponseData, IResponseSingleData } from '@/services/service.types'
import type {
	IRole, IUserSalary, IPatchedUserSalary,
	IAdminUser, IPatchedAdminUser,
	IAdminUserParams, IRoleParams, IUserSalaryParams
} from './admin.types'

export const adminService = {
	// ── Users ─────────────────────────────────────────────
	async getUsers(params?: IAdminUserParams): Promise<IResponseData<IAdminUser>> {
		const { data } = await $authHost.get('/admins/users', { params })
		return data
	},
	async getUser(id: number): Promise<IResponseSingleData<IAdminUser>> {
		const { data } = await $authHost.get(`/admins/users/${id}`)
		return data
	},
	async createUser(payload: IAdminUser): Promise<IResponseSingleData<IAdminUser>> {
		const { data } = await $authHost.post('/admins/users', payload)
		return data
	},
	async updateUser(id: number, payload: IAdminUser): Promise<IResponseSingleData<IAdminUser>> {
		const { data } = await $authHost.put(`/admins/users/${id}`, payload)
		return data
	},
	async patchUser(id: number, payload: IPatchedAdminUser): Promise<IResponseSingleData<IAdminUser>> {
		const { data } = await $authHost.patch(`/admins/users/${id}`, payload)
		return data
	},
	async deleteUser(id: number): Promise<void> {
		await $authHost.delete(`/admins/users/${id}`)
	},

	// ── Roles ─────────────────────────────────────────────
	async getRoles(params?: IRoleParams): Promise<IResponseData<IRole>> {
		const { data } = await $authHost.get('/admins/roles', { params })
		return data
	},
	async getRole(id: number): Promise<IResponseSingleData<IRole>> {
		const { data } = await $authHost.get(`/admins/roles/${id}`)
		return data
	},
	async createRole(payload: IRole): Promise<IResponseSingleData<IRole>> {
		const { data } = await $authHost.post('/admins/roles', payload)
		return data
	},
	async updateRole(id: number, payload: IRole): Promise<IResponseSingleData<IRole>> {
		const { data } = await $authHost.put(`/admins/roles/${id}`, payload)
		return data
	},
	async deleteRole(id: number): Promise<void> {
		await $authHost.delete(`/admins/roles/${id}`)
	},

	// ── User Salaries ──────────────────────────────────────
	async getUserSalaries(params?: IUserSalaryParams): Promise<IResponseData<IUserSalary>> {
		const { data } = await $authHost.get('/admins/user-salaries', { params })
		return data
	},
	async getUserSalary(id: number): Promise<IResponseSingleData<IUserSalary>> {
		const { data } = await $authHost.get(`/admins/user-salaries/${id}`)
		return data
	},
	async createUserSalary(payload: IUserSalary): Promise<IResponseSingleData<IUserSalary>> {
		const { data } = await $authHost.post('/admins/user-salaries', payload)
		return data
	},
	async updateUserSalary(id: number, payload: IUserSalary): Promise<IResponseSingleData<IUserSalary>> {
		const { data } = await $authHost.put(`/admins/user-salaries/${id}`, payload)
		return data
	},
	async patchUserSalary(id: number, payload: IPatchedUserSalary): Promise<IResponseSingleData<IUserSalary>> {
		const { data } = await $authHost.patch(`/admins/user-salaries/${id}`, payload)
		return data
	},
	async deleteUserSalary(id: number): Promise<void> {
		await $authHost.delete(`/admins/user-salaries/${id}`)
	},
}