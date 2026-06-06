import type { components } from '@/api/schema'

export type IMaterial = components['schemas']['Material']
export type IPatchedMaterial = components['schemas']['PatchedMaterial']
export type IPaginatedMaterialList = components['schemas']['PaginatedMaterialList']

export type ICategory = components['schemas']['MaterialCategory']
export type IPatchedCategory = components['schemas']['PatchedMaterialCategory']

export type IUnit = components['schemas']['MeasurementUnit']
export type IPatchedUnit = components['schemas']['PatchedMeasurementUnit']

export type IOffcut = components['schemas']['Offcut']
export type IPatchedOffcut = components['schemas']['PatchedOffcut']

export type IReservation = components['schemas']['MaterialReservation']
export type IPatchedReservation = components['schemas']['PatchedMaterialReservation']

export interface IMaterialParams {
	page?: number
	limit?: number
	search?: string
	category?: number
	ordering?: string
}

export interface IOffcutParams {
	page?: number
	limit?: number
	material?: number
	is_used?: boolean
}

export interface IReservationParams {
	page?: number
	limit?: number
	material?: number
	search?: string
}
