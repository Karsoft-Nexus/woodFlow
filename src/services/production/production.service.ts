import { $authHost } from '@/api'
import type { IResponseData, IResponseSingleData } from '@/services/service.types'
import type { IProductionStage, IPatchedProductionStage, IBoardDataResponse, IPayoutResponse, IProductionStageParams } from './production.types'

export const productionService = {
	// ── Kanban Board ────────────────────────────────────────
	async getBoardData(): Promise<IBoardDataResponse> {
		const { data } = await $authHost.get('/production/board/')
		return data
	},

	// ── Worker actions ──────────────────────────────────────
	async setDailyStatus(workerId: string, daily_status: string): Promise<unknown> {
		const { data } = await $authHost.post(`/workers/${workerId}/set-daily-status/`, { daily_status })
		return data
	},
	async getWorkerPayouts(workerId: string): Promise<IPayoutResponse[]> {
		const { data } = await $authHost.get(`/workers/${workerId}/payouts/`)
		return data
	},

	// ── Stage workflow ──────────────────────────────────────
	async startStage(stageId: string, worker_id: string): Promise<unknown> {
		const { data } = await $authHost.post(`/production/stages/${stageId}/start/`, { worker_id })
		return data
	},
	async finishStage(stageId: string): Promise<unknown> {
		const { data } = await $authHost.post(`/production/stages/${stageId}/finish/`)
		return data
	},

	// ── Production Stages CRUD ──────────────────────────────
	async getStages(params?: IProductionStageParams): Promise<IResponseData<IProductionStage>> {
		const { data } = await $authHost.get('/production-stages', { params })
		return data
	},
	async getStage(id: number): Promise<IResponseSingleData<IProductionStage>> {
		const { data } = await $authHost.get(`/production-stages/${id}`)
		return data
	},
	async createStage(payload: IProductionStage): Promise<IResponseSingleData<IProductionStage>> {
		const { data } = await $authHost.post('/production-stages', payload)
		return data
	},
	async updateStage(id: number, payload: IProductionStage): Promise<IResponseSingleData<IProductionStage>> {
		const { data } = await $authHost.put(`/production-stages/${id}`, payload)
		return data
	},
	async patchStage(id: number, payload: IPatchedProductionStage): Promise<IResponseSingleData<IProductionStage>> {
		const { data } = await $authHost.patch(`/production-stages/${id}`, payload)
		return data
	},
	async deleteStage(id: number): Promise<void> {
		await $authHost.delete(`/production-stages/${id}`)
	},
}
