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
import { sortTransactionsByRecency } from '@/utils/transactions'

const ensureCanCreateTransaction = (membership) => {
  if (
    membership.role !== WALLET_MEMBER_ROLES.OWNER &&
    membership.role !== WALLET_MEMBER_ROLES.EDITOR
  ) {
    throw new Error('Você não possui permissão para criar transações')
  }
}

const ensureTransactionInWallet = ({ transaction, walletId }) => {
  if (!transaction || !isSameId(transaction.walletId, walletId)) {
    throw new Error('Transação não encontrada')
  }
}

const findCategoryForTransaction = ({ userId, categoryId, type }) => {
  if (!categoryId) return null

  const category = findCategoryById(categoryId)

  if (!category || !isSameId(category.userId, userId)) {
    throw new Error('A categoria precisa pertencer ao usuário atual')
  }

  if (category.type !== type) {
    throw new Error(
      'O tipo da categoria deve corresponder ao tipo da transação',
    )
  }

  return category
}

const toPublicTransactionWithCategory = (transaction) =>
  toPublicTransaction(transaction, findCategoryById(transaction.categoryId))

export async function listTransactionsForWallet({ walletId, userId }) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletAccess({ walletId, userId })

  return sortTransactionsByRecency(listTransactionsByWalletId(walletId)).map(
    toPublicTransactionWithCategory,
  )
}

export async function createTransaction({
  walletId,
  userId,
  categoryId,
  description,
  amount,
  type,
  transactionDate,
}) {
  await latency()

  ensureAuthenticatedUser(userId)
  const membership = ensureWalletAccess({ walletId, userId })
  ensureCanCreateTransaction(membership)
  validateTransactionInput({ description, amount, type, transactionDate })
  const category = findCategoryForTransaction({ userId, categoryId, type })
  const transaction = createTransactionRecord({
    walletId,
    categoryId: category?.id ?? null,
    recordedById: userId,
    description,
    amount,
    type,
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
  type,
  transactionDate,
}) {
  await latency()

  ensureAuthenticatedUser(userId)
  const membership = ensureWalletAccess({ walletId, userId })
  const transaction = findTransactionById(transactionId)
  ensureTransactionInWallet({ transaction, walletId })

  if (
    membership.role !== WALLET_MEMBER_ROLES.OWNER &&
    membership.role !== WALLET_MEMBER_ROLES.EDITOR
  ) {
    throw new Error('Você não possui permissão para editar esta transação')
  }

  validateTransactionInput({ description, amount, type, transactionDate })
  const category = findCategoryForTransaction({ userId, categoryId, type })
  const nextTransaction = updateTransactionRecord({
    transaction,
    categoryId: category?.id ?? null,
    description,
    amount,
    type,
    transactionDate,
  })

  replaceTransaction(nextTransaction)

  return { transaction: toPublicTransaction(nextTransaction, category) }
}

export async function removeTransaction({ walletId, userId, transactionId }) {
  await latency()

  ensureAuthenticatedUser(userId)
  const membership = ensureWalletAccess({ walletId, userId })

  if (
    membership.role !== WALLET_MEMBER_ROLES.OWNER &&
    membership.role !== WALLET_MEMBER_ROLES.EDITOR
  ) {
    throw new Error('Você não possui permissão para excluir transações')
  }

  const transaction = findTransactionById(transactionId)
  ensureTransactionInWallet({ transaction, walletId })
  removeTransactionRecord(transactionId)
}
