import { $authHost } from '@/api'
import type { IResponseData, IResponseSingleData } from '@/services/service.types'
import type { IWarehouseTransaction, IPatchedWarehouseTransaction, IWarehouseTransactionParams } from './warehouse.types'

export const warehouseService = {
	async getTransactions(params?: IWarehouseTransactionParams): Promise<IResponseData<IWarehouseTransaction>> {
		const { data } = await $authHost.get('/transactions', { params })
		return data
	},
	async getTransaction(id: number): Promise<IResponseSingleData<IWarehouseTransaction>> {
		const { data } = await $authHost.get(`/transactions/${id}`)
		return data
	},
	async createTransaction(payload: IWarehouseTransaction): Promise<IResponseSingleData<IWarehouseTransaction>> {
		const { data } = await $authHost.post('/transactions', payload)
		return data
	},
	async updateTransaction(id: number, payload: IWarehouseTransaction): Promise<IResponseSingleData<IWarehouseTransaction>> {
		const { data } = await $authHost.put(`/transactions/${id}`, payload)
		return data
	},
	async patchTransaction(id: number, payload: IPatchedWarehouseTransaction): Promise<IResponseSingleData<IWarehouseTransaction>> {
		const { data } = await $authHost.patch(`/transactions/${id}`, payload)
		return data
	},
	async deleteTransaction(id: number): Promise<void> {
		await $authHost.delete(`/transactions/${id}`)
	},
}
