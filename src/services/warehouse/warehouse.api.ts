import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { warehouseService } from './warehouse.service'
import type { IWarehouseTransaction, IPatchedWarehouseTransaction, IWarehouseTransactionParams } from './warehouse.types'

export const useGetWarehouseTransactions = (params?: IWarehouseTransactionParams) => {
	return useQuery({
		queryKey: ['warehouse-transactions', params],
		queryFn: () => warehouseService.getTransactions(params),
	})
}

export const useCreateWarehouseTransaction = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-warehouse-transaction'],
		mutationFn: (payload: IWarehouseTransaction) => warehouseService.createTransaction(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['warehouse-transactions'] })
			queryClient.invalidateQueries({ queryKey: ['materials'] })
		},
	})
}

export const usePatchWarehouseTransaction = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['patch-warehouse-transaction'],
		mutationFn: ({ id, data }: { id: number; data: IPatchedWarehouseTransaction }) =>
			warehouseService.patchTransaction(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouse-transactions'] }),
	})
}

export const useDeleteWarehouseTransaction = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-warehouse-transaction'],
		mutationFn: (id: number) => warehouseService.deleteTransaction(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouse-transactions'] }),
	})
}
