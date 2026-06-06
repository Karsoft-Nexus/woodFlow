import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersService } from './orders.service'
import type { IOrderCreate, IOrderPatch, IOrderParams, ISignContractPayload, ICustomerCreate } from './orders.types'

// ── Orders ─────────────────────────────────────────────────────
export const useGetOrders = (params?: IOrderParams) => {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => ordersService.getOrders(params),
	})
}

export const useGetOrder = (id: number) => {
	return useQuery({
		queryKey: ['order', id],
		queryFn: () => ordersService.getOrder(id),
		enabled: !!id,
	})
}

export const useCreateOrder = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-order'],
		mutationFn: (payload: IOrderCreate) => ordersService.createOrder(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}

export const useUpdateOrder = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['update-order'],
		mutationFn: ({ id, data }: { id: number; data: IOrderPatch }) =>
			ordersService.updateOrder(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}

export const useDeleteOrder = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-order'],
		mutationFn: (id: number) => ordersService.deleteOrder(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}

// ── Workflow ────────────────────────────────────────────────────
export const useAssignZamer = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['assign-zamer'],
		mutationFn: ({ orderId, zamerchik, zamer_scheduled_at }: { orderId: number; zamerchik: number; zamer_scheduled_at?: string }) =>
			ordersService.assignZamer(orderId, { zamerchik, zamer_scheduled_at }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}

export const useUploadZamer = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['upload-zamer'],
		mutationFn: ({ orderId, zamer_dimensions, zamer_photos_url }: { orderId: number; zamer_dimensions: string; zamer_photos_url?: string }) =>
			ordersService.uploadZamer(orderId, { zamer_dimensions, zamer_photos_url }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}

export const useUploadDesign = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['upload-design'],
		mutationFn: ({ orderId, design_3d_url }: { orderId: number; design_3d_url: string }) =>
			ordersService.uploadDesign(orderId, { design_3d_url }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}

export const useApproveDesign = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['approve-design'],
		mutationFn: (orderId: number) => ordersService.approveDesign(orderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}

export const useSignContract = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['sign-contract'],
		mutationFn: ({ orderId, payload }: { orderId: number; payload: ISignContractPayload }) =>
			ordersService.signContract(orderId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
			queryClient.invalidateQueries({ queryKey: ['production-board'] })
		},
	})
}

// ── Customers ────────────────────────────────────────────────────
export const useGetCustomers = (params?: { search?: string; page?: number; limit?: number }) => {
	return useQuery({
		queryKey: ['customers', params],
		queryFn: () => ordersService.getCustomers(params),
	})
}

export const useCreateCustomer = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-customer'],
		mutationFn: (payload: ICustomerCreate) => ordersService.createCustomer(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] })
		},
	})
}

export const useDeleteCustomer = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-customer'],
		mutationFn: (id: number) => ordersService.deleteCustomer(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] })
		},
	})
}
