import {
  createCategory as createCategoryRecord,
  toPublicCategory,
} from '@/mocks/models/categoryModel'
import { ensureAuthenticatedUser } from '@/mocks/policies/authPolicy.mock'
import {
  ensureWalletAccess,
  ensureWalletOwner,
} from '@/mocks/policies/walletAccessPolicy.mock'
import {
  appendCategory,
  findCategoryByNameInWallet,
  listCategoriesByWalletId,
} from '@/mocks/repositories/categoryRepository.mock'
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
