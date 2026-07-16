import {
  createCategory as createCategoryRecord,
  toPublicCategory,
  updateCategory as updateCategoryRecord,
} from '@/mocks/models/categoryModel'
import { ensureAuthenticatedUser } from '@/mocks/policies/authPolicy.mock'
import {
  appendCategory,
  findCategoryById,
  findCategoryByNameForUser,
  listCategoriesByUserId,
  removeCategory as removeCategoryRecord,
  replaceCategory,
} from '@/mocks/repositories/categoryRepository.mock'
import { hasTransactionsForCategory } from '@/mocks/repositories/transactionRepository.mock'
import { latency } from '@/mocks/utils/fakeLatency'
import { isSameId } from '@/mocks/utils/id'
import { validateCategoryInput } from '@/mocks/validators/categoryValidator'

const findOwnedCategory = ({ categoryId, userId }) => {
  const category = findCategoryById(categoryId)

  if (!category || !isSameId(category.userId, userId)) {
    throw new Error('Categoria não encontrada')
  }

  return category
}

export async function listCategoriesForUser({ userId }) {
  await latency()

  ensureAuthenticatedUser(userId)

  return listCategoriesByUserId(userId).map(toPublicCategory)
}

export async function createCategory({
  userId,
  name,
  type,
  color = '',
  icon = '',
}) {
  await latency()

  ensureAuthenticatedUser(userId)
  validateCategoryInput({ name, type })

  if (findCategoryByNameForUser({ userId, name })) {
    throw new Error('Já existe uma categoria com este nome')
  }

  const category = createCategoryRecord({ userId, name, type, color, icon })
  appendCategory(category)

  return { category: toPublicCategory(category) }
}

export async function updateCategory({
  userId,
  categoryId,
  name,
  type,
  color = '',
  icon = '',
}) {
  await latency()

  ensureAuthenticatedUser(userId)
  validateCategoryInput({ name, type })

  const category = findOwnedCategory({ categoryId, userId })
  const categoryWithSameName = findCategoryByNameForUser({ userId, name })

  if (categoryWithSameName && categoryWithSameName.id !== category.id) {
    throw new Error('Já existe uma categoria com este nome')
  }

  if (category.type !== type && hasTransactionsForCategory(category.id)) {
    throw new Error('Não é possível alterar o tipo de uma categoria usada por transações')
  }

  const nextCategory = updateCategoryRecord({ category, name, type, color, icon })
  replaceCategory(nextCategory)

  return { category: toPublicCategory(nextCategory) }
}

export async function removeCategory({ userId, categoryId }) {
  await latency()

  ensureAuthenticatedUser(userId)
  const category = findOwnedCategory({ categoryId, userId })

  if (hasTransactionsForCategory(category.id)) {
    throw new Error('Não é possível excluir uma categoria usada por transações')
  }

  removeCategoryRecord(category.id)
}
