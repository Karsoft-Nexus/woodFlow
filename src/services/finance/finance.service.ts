import { $authHost } from '@/api'
import type { IFinancialTransaction, IFinancialTransactionCreate } from './finance.types'

export const financeService = {
	async getTransactions(): Promise<IFinancialTransaction[]> {
		const { data } = await $authHost.get('/finance/transactions/')
		return data
	},
	async addTransaction(payload: IFinancialTransactionCreate): Promise<IFinancialTransaction> {
		const { data } = await $authHost.post('/finance/transactions/', payload)
		return data
	},
	async deleteTransaction(id: string): Promise<void> {
		await $authHost.delete(`/finance/transactions/${id}/`)
	},
}
