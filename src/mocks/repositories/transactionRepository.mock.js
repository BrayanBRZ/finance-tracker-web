import {
  readTransactions,
  writeTransactions,
} from '@/mocks/data/transactionData'
import { isSameId } from '@/mocks/utils/id'

export function listTransactions() {
  return readTransactions()
}

export function listTransactionsByWalletId(walletId) {
  return listTransactions().filter((transaction) =>
    isSameId(transaction.walletId, walletId),
  )
}

export function findTransactionById(transactionId) {
  return listTransactions().find((transaction) =>
    isSameId(transaction.id, transactionId),
  )
}

export function hasTransactionsForCategory(categoryId) {
  return listTransactions().some((transaction) =>
    isSameId(transaction.categoryId, categoryId),
  )
}

export function appendTransaction(transaction) {
  writeTransactions([...listTransactions(), transaction])
}

export function replaceTransaction(nextTransaction) {
  writeTransactions(
    listTransactions().map((transaction) =>
      isSameId(transaction.id, nextTransaction.id)
        ? nextTransaction
        : transaction,
    ),
  )
}

export function removeTransaction(transactionId) {
  writeTransactions(
    listTransactions().filter(
      (transaction) => !isSameId(transaction.id, transactionId),
    ),
  )
}

export function removeTransactionsByWalletId(walletId) {
  writeTransactions(
    listTransactions().filter(
      (transaction) => !isSameId(transaction.walletId, walletId),
    ),
  )
}
