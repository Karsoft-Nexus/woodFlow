import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bomService } from './bom.service'
import type { IBOM, IPatchedBOM, IBOMParams } from './bom.types'

export const useGetBOMs = (params?: IBOMParams) => {
	return useQuery({
		queryKey: ['boms', params],
		queryFn: () => bomService.getBOMs(params),
	})
}

export const useGetBOM = (id: number) => {
	return useQuery({
		queryKey: ['bom', id],
		queryFn: () => bomService.getBOM(id),
		enabled: !!id,
	})
}

export const useCreateBOM = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-bom'],
		mutationFn: (payload: IBOM) => bomService.createBOM(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boms'] }),
	})
}

export const usePatchBOM = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['patch-bom'],
		mutationFn: ({ id, data }: { id: number; data: IPatchedBOM }) =>
			bomService.patchBOM(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boms'] }),
	})
}

export const useDeleteBOM = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-bom'],
		mutationFn: (id: number) => bomService.deleteBOM(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boms'] }),
	})
}
