import * as transactionApi from '@/mocks/api/transactionApi.mock'

export const listTransactionsForWallet = (params) =>
  transactionApi.listTransactionsForWallet(params)

export const createTransaction = (params) => transactionApi.createTransaction(params)

export const updateTransaction = (params) => transactionApi.updateTransaction(params)

export const removeTransaction = (params) => transactionApi.removeTransaction(params)
