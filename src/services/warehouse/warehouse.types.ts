import type { components } from '@/api/schema'

export type IWarehouseTransaction = components['schemas']['WarehouseTransaction']
export type IPatchedWarehouseTransaction = components['schemas']['PatchedWarehouseTransaction']

export interface IWarehouseTransactionParams {
	page?: number
	limit?: number
	transaction_type?: string
	material?: number
	ordering?: string
}
