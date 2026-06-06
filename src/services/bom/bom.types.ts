import type { components } from '@/api/schema'

export type IBOM = components['schemas']['BOM']
export type IPatchedBOM = components['schemas']['PatchedBOM']
export type IPaginatedBOMList = components['schemas']['PaginatedBOMList']

export interface IBOMParams {
	page?: number
	limit?: number
	order?: number
	material?: number
	search?: string
}