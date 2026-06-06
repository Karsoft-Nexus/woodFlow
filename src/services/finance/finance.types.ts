import type { FinancialTransaction } from '@/types'

export type IFinancialTransaction = FinancialTransaction

export interface IFinancialTransactionCreate extends Omit<IFinancialTransaction, 'id' | 'createdAt'> {}
