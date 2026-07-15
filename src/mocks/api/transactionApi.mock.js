import {
  createTransaction as createTransactionRecord,
  toPublicTransaction,
  updateTransaction as updateTransactionRecord,
} from '@/mocks/models/transactionModel'
import { ensureAuthenticatedUser } from '@/mocks/policies/authPolicy.mock'
import { ensureWalletAccess } from '@/mocks/policies/walletAccessPolicy.mock'
import { findCategoryById } from '@/mocks/repositories/categoryRepository.mock'
import {
  appendTransaction,
  findTransactionById,
  listTransactionsByWalletId,
  removeTransaction as removeTransactionRecord,
  replaceTransaction,
} from '@/mocks/repositories/transactionRepository.mock'
import { latency } from '@/mocks/utils/fakeLatency'
import { isSameId } from '@/mocks/utils/id'
import { validateTransactionInput } from '@/mocks/validators/transactionValidator'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'

const ensureCanCreateTransaction = (membership) => {
  if (
    membership.role !== WALLET_MEMBER_ROLES.OWNER &&
    membership.role !== WALLET_MEMBER_ROLES.COLLABORATOR
  ) {
    throw new Error('Você não possui permissão para criar transações')
  }
}

const ensureTransactionInWallet = ({ transaction, walletId }) => {
  if (!transaction || !isSameId(transaction.walletId, walletId)) {
    throw new Error('Transação não encontrada')
  }
}

const findCategoryForTransaction = ({ walletId, categoryId }) => {
  const category = findCategoryById(categoryId)

  if (!category || !isSameId(category.walletId, walletId)) {
    throw new Error('A categoria precisa pertencer à carteira atual')
  }

  return category
}

const toPublicTransactionWithCategory = (transaction) =>
  toPublicTransaction(transaction, findCategoryById(transaction.categoryId))

const compareRecentTransactions = (left, right) => {
  const dateComparison = right.transactionDate.localeCompare(left.transactionDate)

  if (dateComparison !== 0) return dateComparison

  return right.createdAt.localeCompare(left.createdAt)
}

export async function listTransactionsForWallet({ walletId, userId }) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletAccess({ walletId, userId })

  return listTransactionsByWalletId(walletId)
    .sort(compareRecentTransactions)
    .map(toPublicTransactionWithCategory)
}

export async function createTransaction({
  walletId,
  userId,
  categoryId,
  description,
  amount,
  transactionDate,
}) {
  await latency()

  ensureAuthenticatedUser(userId)
  const membership = ensureWalletAccess({ walletId, userId })
  ensureCanCreateTransaction(membership)
  validateTransactionInput({ description, amount, transactionDate })
  const category = findCategoryForTransaction({ walletId, categoryId })
  const transaction = createTransactionRecord({
    walletId,
    categoryId,
    recordedById: userId,
    description,
    amount,
    type: category.type,
    transactionDate,
  })

  appendTransaction(transaction)

  return { transaction: toPublicTransaction(transaction, category) }
}

export async function updateTransaction({
  walletId,
  userId,
  transactionId,
  categoryId,
  description,
  amount,
  transactionDate,
}) {
  await latency()

  ensureAuthenticatedUser(userId)
  const membership = ensureWalletAccess({ walletId, userId })
  const transaction = findTransactionById(transactionId)
  ensureTransactionInWallet({ transaction, walletId })

  if (
    membership.role !== WALLET_MEMBER_ROLES.OWNER &&
    (!isSameId(transaction.recordedById, userId) ||
      membership.role !== WALLET_MEMBER_ROLES.COLLABORATOR)
  ) {
    throw new Error('Você não possui permissão para editar esta transação')
  }

  validateTransactionInput({ description, amount, transactionDate })
  const category = findCategoryForTransaction({ walletId, categoryId })
  const nextTransaction = updateTransactionRecord({
    transaction,
    categoryId,
    description,
    amount,
    type: category.type,
    transactionDate,
  })

  replaceTransaction(nextTransaction)

  return { transaction: toPublicTransaction(nextTransaction, category) }
}

export async function removeTransaction({ walletId, userId, transactionId }) {
  await latency()

  ensureAuthenticatedUser(userId)
  const membership = ensureWalletAccess({ walletId, userId })

  if (membership.role !== WALLET_MEMBER_ROLES.OWNER) {
    throw new Error('Apenas o proprietário pode excluir transações')
  }

  const transaction = findTransactionById(transactionId)
  ensureTransactionInWallet({ transaction, walletId })
  removeTransactionRecord(transactionId)

  return null
}
