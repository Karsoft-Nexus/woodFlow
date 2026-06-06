import { $authHost } from '@/api'
import type { IResponseData, IResponseSingleData } from '@/services/service.types'
import type { ICustomer, ICustomerCreate, IOrder, IOrderCreate, IOrderPatch, IOrderParams, ISignContractPayload } from './orders.types'

export const ordersService = {
	// ── Orders ─────────────────────────────────────────────
	async getOrders(params?: IOrderParams): Promise<IResponseData<IOrder>> {
		const { data } = await $authHost.get('/orders', { params })
		return data
	},
	async getOrder(id: number): Promise<IResponseSingleData<IOrder>> {
		const { data } = await $authHost.get(`/orders/${id}`)
		return data
	},
	async createOrder(payload: IOrderCreate): Promise<IResponseSingleData<IOrder>> {
		const { data } = await $authHost.post('/orders', payload)
		return data
	},
	async updateOrder(id: number, payload: IOrderPatch): Promise<IResponseSingleData<IOrder>> {
		const { data } = await $authHost.patch(`/orders/${id}`, payload)
		return data
	},
	async deleteOrder(id: number): Promise<void> {
		await $authHost.delete(`/orders/${id}`)
	},

	// ── Workflow actions ────────────────────────────────────
	async assignZamer(orderId: number, payload: { zamerchik: number; zamer_scheduled_at?: string }): Promise<IResponseSingleData<IOrder>> {
		const { data } = await $authHost.post(`/orders/${orderId}/assign-zamer`, payload)
		return data
	},
	async uploadZamer(orderId: number, payload: { zamer_dimensions: string; zamer_photos_url?: string }): Promise<IResponseSingleData<IOrder>> {
		const { data } = await $authHost.post(`/orders/${orderId}/upload-zamer`, payload)
		return data
	},
	async uploadDesign(orderId: number, payload: { design_3d_url: string }): Promise<IResponseSingleData<IOrder>> {
		const { data } = await $authHost.post(`/orders/${orderId}/upload-design`, payload)
		return data
	},
	async approveDesign(orderId: number): Promise<IResponseSingleData<IOrder>> {
		const { data } = await $authHost.post(`/orders/${orderId}/approve-design`)
		return data
	},
	async signContract(orderId: number, payload: ISignContractPayload): Promise<IResponseSingleData<IOrder>> {
		const { data } = await $authHost.post(`/orders/${orderId}/sign-contract`, payload)
		return data
	},

	// ── Customers ──────────────────────────────────────────
	async getCustomers(params?: { search?: string; page?: number; limit?: number }): Promise<IResponseData<ICustomer>> {
		const { data } = await $authHost.get('/customers', { params })
		return data
	},
	async getCustomer(id: number): Promise<IResponseSingleData<ICustomer>> {
		const { data } = await $authHost.get(`/customers/${id}`)
		return data
	},
	async createCustomer(payload: ICustomerCreate): Promise<IResponseSingleData<ICustomer>> {
		const { data } = await $authHost.post('/customers', payload)
		return data
	},
	async updateCustomer(id: number, payload: Partial<ICustomerCreate>): Promise<IResponseSingleData<ICustomer>> {
		const { data } = await $authHost.patch(`/customers/${id}`, payload)
		return data
	},
	async deleteCustomer(id: number): Promise<void> {
		await $authHost.delete(`/customers/${id}`)
	},
}
