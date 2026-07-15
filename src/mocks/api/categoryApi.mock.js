import {
  createCategory as createCategoryRecord,
  toPublicCategory,
  updateCategory as updateCategoryRecord,
} from '@/mocks/models/categoryModel'
import { ensureAuthenticatedUser } from '@/mocks/policies/authPolicy.mock'
import {
  ensureWalletAccess,
  ensureWalletOwner,
} from '@/mocks/policies/walletAccessPolicy.mock'
import {
  appendCategory,
  findCategoryById,
  findCategoryByNameInWallet,
  listCategoriesByWalletId,
  removeCategory as removeCategoryRecord,
  replaceCategory,
} from '@/mocks/repositories/categoryRepository.mock'
import { hasTransactionsForCategory } from '@/mocks/repositories/transactionRepository.mock'
import { latency } from '@/mocks/utils/fakeLatency'
import { validateCategoryInput } from '@/mocks/validators/categoryValidator'

export async function listCategoriesForWallet({ walletId, userId }) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletAccess({ walletId, userId })

  return listCategoriesByWalletId(walletId).map(toPublicCategory)
}

export async function createCategory({
  walletId,
  userId,
  name,
  type,
  color = '',
  icon = '',
}) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletOwner({ walletId, userId })
  validateCategoryInput({ name, type })

  if (findCategoryByNameInWallet({ walletId, name })) {
    throw new Error('Já existe uma categoria com este nome nesta carteira')
  }

  const category = createCategoryRecord({
    walletId,
    name,
    type,
    color,
    icon,
  })

  appendCategory(category)

  return {
    category: toPublicCategory(category),
  }
}

export async function updateCategory({
  walletId,
  userId,
  categoryId,
  name,
  type,
  color = '',
  icon = '',
}) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletOwner({ walletId, userId })
  validateCategoryInput({ name, type })

  const category = findCategoryById(categoryId)

  if (!category || category.walletId !== walletId) {
    throw new Error('Categoria não encontrada')
  }

  const categoryWithSameName = findCategoryByNameInWallet({ walletId, name })

  if (categoryWithSameName && categoryWithSameName.id !== category.id) {
    throw new Error('Já existe uma categoria com este nome nesta carteira')
  }

  if (category.type !== type && hasTransactionsForCategory(category.id)) {
    throw new Error('Não é possível alterar o tipo de uma categoria usada por transações')
  }

  const nextCategory = updateCategoryRecord({ category, name, type, color, icon })
  replaceCategory(nextCategory)

  return { category: toPublicCategory(nextCategory) }
}

export async function removeCategory({ walletId, userId, categoryId }) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletOwner({ walletId, userId })

  const category = findCategoryById(categoryId)

  if (!category || category.walletId !== walletId) {
    throw new Error('Categoria não encontrada')
  }

  if (hasTransactionsForCategory(category.id)) {
    throw new Error('Não é possível excluir uma categoria usada por transações')
  }

  removeCategoryRecord(category.id)

  return null
}
