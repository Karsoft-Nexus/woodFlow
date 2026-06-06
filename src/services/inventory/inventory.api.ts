import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryService } from './inventory.service'
import type { IMaterial, IPatchedMaterial, ICategory, IUnit, IOffcut, IReservation, IMaterialParams, IOffcutParams } from './inventory.types'

// ── Categories ──────────────────────────────────────────────────
export const useGetCategories = (params?: { page?: number; limit?: number; search?: string }) => {
	return useQuery({
		queryKey: ['categories', params],
		queryFn: () => inventoryService.getCategories(params),
	})
}

export const useCreateCategory = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-category'],
		mutationFn: (payload: ICategory) => inventoryService.createCategory(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
	})
}

export const useUpdateCategory = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['update-category'],
		mutationFn: ({ id, data }: { id: number; data: ICategory }) =>
			inventoryService.updateCategory(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
	})
}

export const useDeleteCategory = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-category'],
		mutationFn: (id: number) => inventoryService.deleteCategory(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
	})
}

// ── Materials ────────────────────────────────────────────────────
export const useGetMaterials = (params?: IMaterialParams) => {
	return useQuery({
		queryKey: ['materials', params],
		queryFn: () => inventoryService.getMaterials(params),
	})
}

export const useGetMaterial = (id: number) => {
	return useQuery({
		queryKey: ['material', id],
		queryFn: () => inventoryService.getMaterial(id),
		enabled: !!id,
	})
}

export const useCreateMaterial = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-material'],
		mutationFn: (payload: IMaterial) => inventoryService.createMaterial(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materials'] }),
	})
}

export const useUpdateMaterial = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['update-material'],
		mutationFn: ({ id, data }: { id: number; data: IMaterial }) =>
			inventoryService.updateMaterial(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materials'] }),
	})
}

export const usePatchMaterial = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['patch-material'],
		mutationFn: ({ id, data }: { id: number; data: IPatchedMaterial }) =>
			inventoryService.patchMaterial(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materials'] }),
	})
}

export const useDeleteMaterial = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-material'],
		mutationFn: (id: number) => inventoryService.deleteMaterial(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materials'] }),
	})
}

// ── Units ────────────────────────────────────────────────────────
export const useGetUnits = (params?: { page?: number; limit?: number; search?: string }) => {
	return useQuery({
		queryKey: ['units', params],
		queryFn: () => inventoryService.getUnits(params),
	})
}

export const useCreateUnit = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-unit'],
		mutationFn: (payload: IUnit) => inventoryService.createUnit(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units'] }),
	})
}

export const useDeleteUnit = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-unit'],
		mutationFn: (id: number) => inventoryService.deleteUnit(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units'] }),
	})
}

// ── Offcuts ──────────────────────────────────────────────────────
export const useGetOffcuts = (params?: IOffcutParams) => {
	return useQuery({
		queryKey: ['offcuts', params],
		queryFn: () => inventoryService.getOffcuts(params),
	})
}

export const useCreateOffcut = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-offcut'],
		mutationFn: (payload: IOffcut) => inventoryService.createOffcut(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['offcuts'] }),
	})
}

// ── Reservations ─────────────────────────────────────────────────
export const useGetReservations = (params?: { page?: number; limit?: number; material?: number }) => {
	return useQuery({
		queryKey: ['reservations', params],
		queryFn: () => inventoryService.getReservations(params),
	})
}

export const useCreateReservation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-reservation'],
		mutationFn: (payload: IReservation) => inventoryService.createReservation(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations'] }),
	})
}

export const useConsumeReservation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['consume-reservation'],
		mutationFn: (payload: { reservation_id: number; consumed_quantity: number }) =>
			inventoryService.consumeReservation(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reservations'] })
			queryClient.invalidateQueries({ queryKey: ['materials'] })
		},
	})
}

export const useCreateCustomReservation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-custom-reservation'],
		mutationFn: (payload: { material_id: number; reserved_quantity: number; expected_date?: string }) =>
			inventoryService.createCustomReservation(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations'] }),
	})
}
