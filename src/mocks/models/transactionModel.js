import { createMockId } from '@/mocks/utils/createMockId'
import { createIsoTimestamp } from '@/mocks/utils/date'
import { normalizeRequiredText } from '@/mocks/utils/text'

export function createTransaction({
  walletId,
  categoryId,
  recordedById,
  description,
  amount,
  type,
  transactionDate,
}) {
  const now = createIsoTimestamp()

  return {
    id: createMockId(),
    walletId,
    categoryId,
    recordedById,
    description: normalizeRequiredText(description),
    amount,
    type,
    transactionDate,
    createdAt: now,
    updatedAt: now,
  }
}

export function updateTransaction({
  transaction,
  categoryId,
  description,
  amount,
  type,
  transactionDate,
}) {
  return {
    ...transaction,
    categoryId,
    description: normalizeRequiredText(description),
    amount,
    type,
    transactionDate,
    updatedAt: createIsoTimestamp(),
  }
}

export function toPublicTransaction(transaction, category) {
  return {
    id: transaction.id,
    walletId: transaction.walletId,
    categoryId: transaction.categoryId,
    recordedById: transaction.recordedById,
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
    transactionDate: transaction.transactionDate,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
    category: category
      ? {
          id: category.id,
          name: category.name,
          type: category.type,
        }
      : null,
  }
}
