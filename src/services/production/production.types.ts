import type { components } from '@/api/schema'

export type IProductionStage = components['schemas']['ProductionStage']
export type IPatchedProductionStage = components['schemas']['PatchedProductionStage']
export type IPaginatedProductionStageList = components['schemas']['PaginatedProductionStageList']

export interface IBoardDataResponse {
	orders: any[]
	workers: any[]
	productionStages: IProductionStage[]
}

export interface IPayoutResponse {
	id: string
	workerId: string
	stageId: string
	amount: number
	stageName: string
	orderNumber: string
	createdAt: string
}

export interface IProductionStageParams {
	page?: number
	limit?: number
	order?: number
	worker?: number
	status?: string
	search?: string
	ordering?: string
}