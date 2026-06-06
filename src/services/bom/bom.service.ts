import { $authHost } from '@/api'
import type { IResponseData, IResponseSingleData } from '@/services/service.types'
import type { IBOM, IPatchedBOM, IBOMParams } from './bom.types'

export const bomService = {
	async getBOMs(params?: IBOMParams): Promise<IResponseData<IBOM>> {
		const { data } = await $authHost.get('/bom', { params })
		return data
	},
	async getBOM(id: number): Promise<IResponseSingleData<IBOM>> {
		const { data } = await $authHost.get(`/bom/${id}`)
		return data
	},
	async createBOM(payload: IBOM): Promise<IResponseSingleData<IBOM>> {
		const { data } = await $authHost.post('/bom', payload)
		return data
	},
	async updateBOM(id: number, payload: IBOM): Promise<IResponseSingleData<IBOM>> {
		const { data } = await $authHost.put(`/bom/${id}`, payload)
		return data
	},
	async patchBOM(id: number, payload: IPatchedBOM): Promise<IResponseSingleData<IBOM>> {
		const { data } = await $authHost.patch(`/bom/${id}`, payload)
		return data
	},
	async deleteBOM(id: number): Promise<void> {
		await $authHost.delete(`/bom/${id}`)
	},
}
