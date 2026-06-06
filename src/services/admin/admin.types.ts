import type { components } from '@/api/schema'

export type IRole = components['schemas']['Role']
export type IUserSalary = components['schemas']['UserSalary']
export type IPatchedUserSalary = components['schemas']['PatchedUserSalary']
export type IAdminUser = components['schemas']['AdminCreate']
export type IPatchedAdminUser = components['schemas']['PatchedAdminCreate']

export interface IAdminUserParams {
	page?: number
	limit?: number
	search?: string
	ordering?: string
}

export interface IRoleParams {
	page?: number
	limit?: number
	search?: string
	code?: string
}

export interface IUserSalaryParams {
	page?: number
	limit?: number
	user?: number
	month?: string
	ordering?: string
}