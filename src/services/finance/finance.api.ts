import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { financeService } from './finance.service'
import type { IFinancialTransactionCreate } from './finance.types'

export const useGetFinanceTransactions = () => {
	return useQuery({
		queryKey: ['finance-transactions'],
		queryFn: () => financeService.getTransactions(),
	})
}

export const useAddFinanceTransaction = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['add-finance-transaction'],
		mutationFn: (payload: IFinancialTransactionCreate) => financeService.addTransaction(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['finance-transactions'] }),
	})
}

export const useDeleteFinanceTransaction = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-finance-transaction'],
		mutationFn: (id: string) => financeService.deleteTransaction(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['finance-transactions'] }),
	})
}
