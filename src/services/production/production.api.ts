import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productionService } from './production.service'
import type { IProductionStage, IPatchedProductionStage, IProductionStageParams } from './production.types'

export const useGetProductionBoard = () => {
	return useQuery({
		queryKey: ['production-board'],
		queryFn: () => productionService.getBoardData(),
		refetchInterval: 30000, // Auto-refetch every 30 seconds
	})
}

export const useSetDailyStatus = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['set-daily-status'],
		mutationFn: ({ workerId, daily_status }: { workerId: string; daily_status: string }) =>
			productionService.setDailyStatus(workerId, daily_status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['production-board'] })
		},
	})
}

export const useGetWorkerPayouts = (workerId: string) => {
	return useQuery({
		queryKey: ['worker-payouts', workerId],
		queryFn: () => productionService.getWorkerPayouts(workerId),
		enabled: !!workerId,
	})
}

export const useStartStage = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['start-stage'],
		mutationFn: ({ stageId, workerId }: { stageId: string; workerId: string }) =>
			productionService.startStage(stageId, workerId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['production-board'] })
		},
	})
}

export const useFinishStage = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['finish-stage'],
		mutationFn: (stageId: string) => productionService.finishStage(stageId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['production-board'] })
		},
	})
}

export const useGetProductionStages = (params?: IProductionStageParams) => {
	return useQuery({
		queryKey: ['production-stages', params],
		queryFn: () => productionService.getStages(params),
	})
}

export const useCreateProductionStage = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-production-stage'],
		mutationFn: (payload: IProductionStage) => productionService.createStage(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['production-stages'] })
			queryClient.invalidateQueries({ queryKey: ['production-board'] })
		},
	})
}

export const usePatchProductionStage = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['patch-production-stage'],
		mutationFn: ({ id, data }: { id: number; data: IPatchedProductionStage }) =>
			productionService.patchStage(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['production-stages'] })
			queryClient.invalidateQueries({ queryKey: ['production-board'] })
		},
	})
}

export const useDeleteProductionStage = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-production-stage'],
		mutationFn: (id: number) => productionService.deleteStage(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['production-stages'] })
		},
	})
}
