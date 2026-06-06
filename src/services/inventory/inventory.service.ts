import { $authHost } from '@/api'
import type { IResponseData, IResponseSingleData } from '@/services/service.types'
import type {
	IMaterial, IPatchedMaterial, ICategory, IPatchedCategory,
	IUnit, IPatchedUnit, IOffcut,
	IReservation, IPatchedReservation,
	IMaterialParams, IOffcutParams, IReservationParams
} from './inventory.types'

export const inventoryService = {
	// ── Categories ──────────────────────────────────────────
	async getCategories(params?: { page?: number; limit?: number; search?: string }): Promise<IResponseData<ICategory>> {
		const { data } = await $authHost.get('/categories', { params })
		return data
	},
	async createCategory(payload: ICategory): Promise<IResponseSingleData<ICategory>> {
		const { data } = await $authHost.post('/categories', payload)
		return data
	},
	async updateCategory(id: number, payload: IPatchedCategory): Promise<IResponseSingleData<ICategory>> {
		const { data } = await $authHost.patch(`/categories/${id}`, payload)
		return data
	},
	async deleteCategory(id: number): Promise<void> {
		await $authHost.delete(`/categories/${id}`)
	},

	// ── Materials ───────────────────────────────────────────
	async getMaterials(params?: IMaterialParams): Promise<IResponseData<IMaterial>> {
		const { data } = await $authHost.get('/materials', { params })
		return data
	},
	async getMaterial(id: number): Promise<IResponseSingleData<IMaterial>> {
		const { data } = await $authHost.get(`/materials/${id}`)
		return data
	},
	async createMaterial(payload: IMaterial): Promise<IResponseSingleData<IMaterial>> {
		const { data } = await $authHost.post('/materials', payload)
		return data
	},
	async updateMaterial(id: number, payload: IMaterial): Promise<IResponseSingleData<IMaterial>> {
		const { data } = await $authHost.put(`/materials/${id}`, payload)
		return data
	},
	async patchMaterial(id: number, payload: IPatchedMaterial): Promise<IResponseSingleData<IMaterial>> {
		const { data } = await $authHost.patch(`/materials/${id}`, payload)
		return data
	},
	async deleteMaterial(id: number): Promise<void> {
		await $authHost.delete(`/materials/${id}`)
	},

	// ── Measurement Units ───────────────────────────────────
	async getUnits(params?: { page?: number; limit?: number; search?: string }): Promise<IResponseData<IUnit>> {
		const { data } = await $authHost.get('/units', { params })
		return data
	},
	async createUnit(payload: IUnit): Promise<IResponseSingleData<IUnit>> {
		const { data } = await $authHost.post('/units', payload)
		return data
	},
	async updateUnit(id: number, payload: IPatchedUnit): Promise<IResponseSingleData<IUnit>> {
		const { data } = await $authHost.patch(`/units/${id}`, payload)
		return data
	},
	async deleteUnit(id: number): Promise<void> {
		await $authHost.delete(`/units/${id}`)
	},

	// ── Offcuts ─────────────────────────────────────────────
	async getOffcuts(params?: IOffcutParams): Promise<IResponseData<IOffcut>> {
		const { data } = await $authHost.get('/offcuts', { params })
		return data
	},
	async createOffcut(payload: IOffcut): Promise<IResponseSingleData<IOffcut>> {
		const { data } = await $authHost.post('/offcuts', payload)
		return data
	},
	async deleteOffcut(id: number): Promise<void> {
		await $authHost.delete(`/offcuts/${id}`)
	},

	// ── Reservations ────────────────────────────────────────
	async getReservations(params?: IReservationParams): Promise<IResponseData<IReservation>> {
		const { data } = await $authHost.get('/reservations', { params })
		return data
	},
	async createReservation(payload: IReservation): Promise<IResponseSingleData<IReservation>> {
		const { data } = await $authHost.post('/reservations', payload)
		return data
	},
	async patchReservation(id: number, payload: IPatchedReservation): Promise<IResponseSingleData<IReservation>> {
		const { data } = await $authHost.patch(`/reservations/${id}`, payload)
		return data
	},
	async deleteReservation(id: number): Promise<void> {
		await $authHost.delete(`/reservations/${id}`)
	},
	async consumeReservation(payload: { reservation_id: number; consumed_quantity: number }): Promise<unknown> {
		const { data } = await $authHost.post('/reservations/consume-reservation', payload)
		return data
	},
	async createCustomReservation(payload: { material_id: number; reserved_quantity: number; expected_date?: string }): Promise<unknown> {
		const { data } = await $authHost.post('/reservations/create-reservation', payload)
		return data
	},
}
